import * as functions from 'firebase-functions'
import admin from 'firebase-admin'
import crypto from 'crypto'
import Razorpay from 'razorpay'

// Initialize Firebase Admin
admin.initializeApp()

// Helper to get Razorpay credentials safely
const getRazorpayClient = () => {
  // Try to get config from firebase functions config
  const cfg = functions.config() || {}
  const keyId = cfg?.razorpay?.key_id
  const keySecret = cfg?.razorpay?.key_secret

  // Fallback check to ensure keys exist
  if (!keyId || !keySecret) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'Missing Razorpay config. Run: firebase functions:config:set razorpay.key_id="YOUR_KEY" razorpay.key_secret="YOUR_SECRET"'
    )
  }

  return {
    keyId,
    keySecret,
    client: new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    }),
  }
}

/**
 * 1. Create Razorpay Order
 * This saves the 'userId' to Firestore so the permission check in your backend passes.
 */
export const createRazorpayOrder = functions.https.onCall(async (data, context) => {
  // 1. Authenticate User
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Login required to place an order.')
  }

  const userId = context.auth.uid
  const total = Number(data?.total || 0)
  const subtotal = Number(data?.subtotal || 0)
  const discount = Number(data?.discount || 0)
  const shipping = Number(data?.shipping || 0)
  const items = Array.isArray(data?.items) ? data.items : []
  const shippingAddress = data?.shippingAddress || {}

  // 2. Validate Data
  if (!Number.isFinite(total) || total <= 0) {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid total amount.')
  }
  if (!Array.isArray(items) || items.length === 0) {
    throw new functions.https.HttpsError('invalid-argument', 'Cart is empty.')
  }

  const { client, keyId } = getRazorpayClient()
  const db = admin.firestore()

  // 3. Create Firestore Order Document
  // CRITICAL: We save 'userId' here so the backend check (order.userId === req.user.uid) passes.
  const orderRef = await db.collection('orders').add({
    userId: userId, 
    customerEmail: String(data?.customerEmail || ''),
    items: items.map((it) => ({
      productId: String(it.productId || it.id || ''),
      title: String(it.title || ''),
      price: Number(it.price || 0),
      quantity: Number(it.quantity || 0),
      image: String(it.image || ''),
    })),
    subtotal: Number(subtotal || 0),
    discount: Number(discount || 0),
    shipping: Number(shipping || 0),
    total: Number(total || 0),
    paymentMethod: 'razorpay',
    paymentStatus: 'pending',
    status: 'Pending',
    adminInstruction: '',
    shippingAddress: {
      firstName: String(shippingAddress.firstName || '').trim(),
      lastName: String(shippingAddress.lastName || '').trim(),
      address: String(shippingAddress.address || '').trim(),
      city: String(shippingAddress.city || '').trim(),
      postalCode: String(shippingAddress.postalCode || '').trim(),
      // Added State and Phone (Required for Shiprocket)
      state: String(shippingAddress.state || '').trim(),
      phone: String(shippingAddress.phone || '').trim(),
      savedAddressId: shippingAddress.savedAddressId || null,
    },
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  })

  // 4. Generate Order Number
  const orderNumber = `ORD-${orderRef.id.slice(0, 8).toUpperCase()}`
  await orderRef.set({ orderNumber }, { merge: true })

  // 5. Create Order on Razorpay
  const amountPaise = Math.round(total * 100)
  
  try {
    const rzpOrder = await client.orders.create({
      amount: amountPaise,
      currency: 'INR',
      receipt: orderRef.id,
      notes: {
        firestoreOrderId: orderRef.id,
        orderNumber,
        userId: userId, 
      },
    })

    // 6. Update Firestore with Razorpay Order ID
    await orderRef.set(
      {
        razorpay: {
          orderId: rzpOrder.id,
          amount: amountPaise,
          currency: rzpOrder.currency,
        },
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true },
    )

    // 7. Return details to Frontend
    return {
      firestoreOrderId: orderRef.id,
      orderNumber,
      razorpayOrderId: rzpOrder.id,
      amount: amountPaise,
      currency: rzpOrder.currency,
      keyId,
    }
  } catch (err) {
    console.error('Razorpay Error:', err)
    throw new functions.https.HttpsError('internal', 'Failed to create Razorpay order.')
  }
})

/**
 * 2. Verify Razorpay Payment
 * Validates the signature returned by the frontend.
 */
export const verifyRazorpayPayment = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Login required')
  }

  const firestoreOrderId = String(data?.firestoreOrderId || '')
  const razorpay_order_id = String(data?.razorpay_order_id || '')
  const razorpay_payment_id = String(data?.razorpay_payment_id || '')
  const razorpay_signature = String(data?.razorpay_signature || '')

  if (!firestoreOrderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing payment details')
  }

  const { keySecret } = getRazorpayClient()

  // 1. Verify Signature
  const generatedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex')

  if (generatedSignature !== razorpay_signature) {
    throw new functions.https.HttpsError('permission-denied', 'Invalid payment signature')
  }

  const db = admin.firestore()
  const orderRef = db.collection('orders').doc(firestoreOrderId)
  const snap = await orderRef.get()

  if (!snap.exists) {
    throw new functions.https.HttpsError('not-found', 'Order not found')
  }

  // 2. Security Check
  const order = snap.data() || {}
  if (String(order.userId || '') !== String(context.auth.uid || '')) {
    throw new functions.https.HttpsError('permission-denied', 'You do not have permission to modify this order.')
  }

  // 3. Mark as Paid
  await orderRef.set(
    {
      paymentStatus: 'paid',
      status: 'Processing',
      razorpay: {
        ...(order.razorpay || {}),
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
        verifiedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true },
  )

  return { ok: true }
})