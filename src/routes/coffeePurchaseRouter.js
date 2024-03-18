import express from 'express'
import coffeePuchase from '../controllers/coffeePurchaseController'
import verifyToken from '../middlewares/auth'
import CoffeePurchaseController from '../controllers/coffeePurchaseController'

const router = express.Router()

router.get('/dailyJournal', verifyToken, coffeePuchase.getSCDailyJournals)
router.get('/dailyJournal/:journalId', verifyToken, coffeePuchase.getSCDailyJournalsByJournalId)
router.get('/dailyJournal/transaction/:id', verifyToken, coffeePuchase.getTransactionById)
router.put('/dailyJournal/transaction/:id', verifyToken, coffeePuchase.removeTransaction)
router.put('/dailyJournal/transaction/update/:id', verifyToken, coffeePuchase.updateTransaction)
// router.post('/dailyJournal/fees', verifyToken, coffeePuchase.addFees)
router.post('/dailyJournal/commissions', verifyToken, coffeePuchase.addCommissions)
router.get('/dailyJournal/daylots', coffeePuchase.getAllDayLot)
router.put('/dailyJournal/journal/approve/:journalId', verifyToken, coffeePuchase.approveJournal)
router.post('/dailyJournal/journalBucket',verifyToken,CoffeePurchaseController.AddTransactionBucket)

export default router