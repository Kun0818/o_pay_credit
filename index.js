const express = require('express');
const opay = require('opay_payment_nodejs')


const app = express();
app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: false }));
app.use(express.json())


app.get('/paymentaction', (req, res) => {

  // let uid = req.query.uid;
  let base_param = {
    MerchantTradeNo: 'faa0d7e9f151b112bc94', //請帶20碼uid, ex: f0a0d7e9fae1bb72bc93
    MerchantTradeDate: onTimeValue(), //ex: 2017/02/13 15:45:30
    TotalAmount: '100',
    TradeDesc: '企鵝玩偶 一隻',
    ItemName: '企鵝玩偶 300元 X 1',
    ReturnURL: ' https://0749-2001-b400-e27c-1241-9d0d-f948-b02e-8a5a.jp.ngrok.io/payment', // 付款結果通知URL
    OrderResultURL: 'https://0749-2001-b400-e27c-1241-9d0d-f948-b02e-8a5a.jp.ngrok.io/paymentactionresult', // 在使用者在付款結束後，將使用者的瀏覽器畫面導向該URL所指定的URL
    EncryptType: 1,
    // ItemURL: 'http://item.test.tw',
    Remark: '該服務繳費成立時，恕不接受退款。',
    // HoldTradeAMT: '1',
    // StoreID: '',
    // UseRedeem: ''
  };

  let create = new opay();
  let parameters = {};
  let invoice = {};
  try {
    let htm = create.payment_client.aio_check_out_credit_onetime(parameters = base_param);
    res.render('payment_action', {
      result: htm
    })

  } catch (err) {
    // console.log(err);
    let error = {
      status: '500',
      stack: ""
    }
    res.render('error', {
      message: err,
      error: error
    })
  }
}
)

app.post('/payment', (req, res) => {
  var rtnCode = req.body.RtnCode;
  var simulatePaid = req.body.SimulatePaid;
  var merchantID = req.body.MerchantID;
  var merchantTradeNo = req.body.MerchantTradeNo;
  var storeID = req.body.StoreID;
  var rtnMsg = req.body.RtnMsg;
  // var tradeNo = req.body.TradeNo;
  var tradeAmt = req.body.TradeAmt;
  // var payAmt = req.body.PayAmt;
  var paymentDate = req.body.PaymentDate;
  var paymentType = req.body.PaymentType;
  // var paymentTypeChargeFee = req.body.PaymentTypeChargeFee;

  let paymentInfo = {
    merchantID: merchantID,
    merchantTradeNo: merchantTradeNo,
    storeID: storeID,
    rtnMsg: rtnMsg,
    paymentDate: paymentDate,
    paymentType: paymentType,
    tradeAmt: tradeAmt
  }

  //(添加simulatePaid模擬付款的判斷 1為模擬付款 0 為正式付款)
  //測試環境
  if (rtnCode === "1" && simulatePaid === "1") {
    // 這部分可與資料庫做互動
    res.write("1|OK");
    res.end();
  }
})

app.post('/paymentactionresult', (req, res) => {
  var merchantID = req.body.MerchantID; //會員編號
  var merchantTradeNo = req.body.MerchantTradeNo; //交易編號
  var storeID = req.body.StoreID; //商店編號
  var rtnMsg = req.body.RtnMsg; //交易訊息
  var paymentDate = req.body.PaymentDate; //付款時間
  var paymentType = req.body.PaymentType; //付款方式
  var tradeAmt = req.body.TradeAmt; //交易金額

  let result = {
    member: {
      merchantID: merchantID,
      merchantTradeNo: merchantTradeNo,
      storeID: storeID,
      rtnMsg: rtnMsg,
      paymentDate: paymentDate,
      paymentType: paymentType,
      tradeAmt: tradeAmt
    }
  }
  console.log("result: " + JSON.stringify(result));
  res.render(
    'payment_result', {
    result: result
  }
  )
}
)

const onTimeValue = function () {
  var date = new Date();
  var mm = date.getMonth() + 1;
  var dd = date.getDate();
  var hh = date.getHours();
  var mi = date.getMinutes();
  var ss = date.getSeconds();

  return [date.getFullYear(), "/" +
    (mm > 9 ? '' : '0') + mm, "/" +
    (dd > 9 ? '' : '0') + dd, " " +
    (hh > 9 ? '' : '0') + hh, ":" +
    (mi > 9 ? '' : '0') + mi, ":" +
    (ss > 9 ? '' : '0') + ss
  ].join('');
};

app.listen(3000);

