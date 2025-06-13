import { Router } from 'express';
import {
  getInvoiceById,
  getCustomerInvoices,
  sendInvoiceByEmail,
  markInvoiceAsSent,
  recordPartialPayment,
  setPaymentTerms
} from '../controllers/invoiceController';

const router = Router();

router.get('/invoices/:orderGroupId', getInvoiceById);
router.get('/customers/:customerId/invoices', getCustomerInvoices);
router.post('/invoices/:orderGroupId/send', sendInvoiceByEmail);
router.patch('/invoices/:orderGroupId/mark-sent', markInvoiceAsSent);
router.post('/invoices/:orderGroupId/record-payment', recordPartialPayment);
router.patch('/invoices/:orderGroupId/payment-terms', setPaymentTerms);

export default router;