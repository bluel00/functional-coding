const format = (number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(number);

const printBill = (totalAmount, volumeCredits, customer, detail) => `
    청구내역 (고객명: ${customer})
    ${detail}
    총액: ${format(totalAmount / 100)}
    적립 포인트: ${volumeCredits}점
  `;

const makeBillItemDetail = (plays, performances) => {
  return performances.reduce((accumulator, { playID, audience }) => {
    const play = getPlayById(plays, playID);

    const amount = calculateAmount(play.type, audience);

    return (
      accumulator + `${play.name} : ${format(amount / 100)} (${audience}석)\n`
    );
  }, '');
};

const calculateVolumeCredits = (plays, performances) => {
  return performances.reduce((accumulator, { playID, audience }) => {
    const extraPoint = isComedy(plays, playID)
      ? Math.floor(perf.audience / 5)
      : 0;

    return accumulator + Math.max(audience - 30, 0) + extraPoint;
  }, 0);
};

const isComedy = (plays, playID) => plays[playID].type === 'comedy';

const calculateComedyAmount = (audience) => {
  const defaultAmount = 30000;

  const extraAmount = audience > 20 ? 10000 + 500 * (audience - 20) : 0;

  return defaultAmount + extraAmount + 300 * audience;
};

const calculateTragedyAmount = (audience) => {
  const defaultAmount = 40000;

  const extraAmount = audience > 30 ? 1000 * (audience - 30) : 0;

  return defaultAmount + extraAmount;
};

const calculateAmount = (type, audience) => {
  return {
    tragedy: calculateTragedyAmount(audience),
    comedy: calculateComedyAmount(audience),
  }[type];

  // TODO: error handling 여기서 하는게 맞나?
  // default:
  //   throw new Error(`알 수 없는 장르 : ${play.type}`);
};

const getPlayById = (plays, id) => arrayGet(plays, id);

const arrayGet = (array, index) => array[index];

const calculateTotalAmount = (plays, performances) => {
  return performances.reduce((accumulator, { playID, audience }) => {
    const play = getPlayById(plays, playID);

    const amount = calculateAmount(play.type, audience);

    return accumulator + amount;
  }, 0);
};

const statement = (invoice, plays) => {
  const totalAmount = calculateTotalAmount(plays, invoice.performances);

  const volumeCredits = calculateVolumeCredits(plays, invoice.performances);

  const detail = makeBillItemDetail(plays, invoice.performances);

  return printBill(totalAmount, volumeCredits, invoice.customer, detail);
};

module.exports = {
  statement,
};
