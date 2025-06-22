import { Router } from 'express';
import {
  makeCustomVoiceCall,
  callOrderStatus,
  callPaymentReminderController,
  callPickupReminderController,
  callOrderCompleteController,
  getVoiceCallStatus,
  checkVoiceCallConfiguration
} from '../controllers/voiceCallController.js';

const router = Router();

// Check if voice calling is configured
router.get('/configuration', checkVoiceCallConfiguration);

// Make a custom voice call
router.post('/make-call', makeCustomVoiceCall);

// Order-related voice calls
router.post('/order-status', callOrderStatus);
router.post('/order-complete', callOrderCompleteController);
router.post('/pickup-reminder', callPickupReminderController);

// Payment-related voice calls
router.post('/payment-reminder', callPaymentReminderController);

// Get call status
router.get('/status/:callSid', getVoiceCallStatus);

export default router;