import invoices from "./invoices.json" assert {type: "json"};
import plays from "./plays.json" assert {type: "json"};


function statement(invoice, plays){
    let totalAmount = 0;
    let volumeCredits = 0;
    let result = `청구 내영 (고객명: ${invoice.customer})\n`;

    for(let perf of invoice.performances) {
        // const play = playFor(perf)
        volumeCredits += volumeCreditsFor(perf);

        // 청구 내역을 출력
        result += `${playFor(perf)}: ${usd(amountFor(perf))} (${perf.audience}석)\n`;
        totalAmount += amountFor(perf);
    }
    result += `총액: ${usd(totalAmount)}\n`;
    result += `적립 포인트: ${volumeCredits}점\n`;
    return result;
}

function usd(aNumber) {
    return new Intl.NumberFormat("en-US", {
        style: "currency", currency: "USD",
        minimumFractionDigits: 2
    }).format(aNumber/100);
}

function amountFor(aPerformance) {
    let result = 0;
    switch (playFor(aPerformance).type) {
        case "tragedy":
            result = 40000;
            if (aPerformance.audience > 30) {
                result += 1000 * (aPerformance.audience - 30);
            }
            break;
        case "comedy":
            result = 30000;
            if (aPerformance.audience > 20) {
                result += 10000 + 500 * (aPerformance.audience - 20);
            }
            break;
        default:
            throw new Error(`알 수 없는 장르 : ${playFor(aPerformance).type}`);
    }
    return result;
}

function volumeCreditsFor(aPerformance) {
    let volumeCredits = 0;
    volumeCredits += Math.max(aPerformance.audience - 30, 0);
    if ("comedy" === playFor(aPerformance).type) {
        volumeCredits += Math.floor(aPerformance.audience / 5);
    }
    return volumeCredits;
}

function playFor(aPerformance) {
    return plays[aPerformance.playID];
}
invoices.map((invoice)=>console.log(statement(invoice, plays)));
