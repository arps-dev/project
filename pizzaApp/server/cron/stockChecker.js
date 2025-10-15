const cron = require('node-cron');
const Ingredient = require('../models/ingredient');
const sendEmail = require('../utils/sendEmail');

const task = cron.schedule('*/5 * * * *', async () => { // every 5 minutes (adjust)
  try {
    const low = await Ingredient.find({ $expr: { $lt: ["$stock", "$threshold"] }});
    if(low && low.length) {
      const admin = process.env.ADMIN_EMAIL;
      let html = '<h3>Low stock alert</h3><ul>';
      low.forEach(i => html += `<li>${i.name} (${i.category}) - stock: ${i.stock}, threshold: ${i.threshold}</li>`);
      html += '</ul>';
      await sendEmail({ to: admin, subject: 'Low stock alert', html });
      console.log('Sent low stock email to admin');
    }
  } catch(err) {
    console.error('Stock checker error', err);
  }
}, { scheduled: false });

module.exports = task;
