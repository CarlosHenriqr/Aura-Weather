const { Router } = require("express");
const alertsController = require("../controllers/alerts.controller");

const router = Router();

// Rota pública — não exige login
router.get("/", alertsController.getAlerts);

module.exports = router;