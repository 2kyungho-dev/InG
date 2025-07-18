import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { ALL } from 'dns';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SERVICE_KEY = 'KnHS3+8STMtO36SZ6ZekxLHJSeLvmKq3JCYCbDorrPiEOxob/P2Ao+fUyHC1hVFI/n1JuWEzCggQXl54DQ4ZwQ==';
const API_URL = 'https://apis.data.go.kr/1160100/service/GetKrxListedInfoService/getItemInfo';
const ALL_CODES = new Set([
  "005930","000660","207940","373220","005380","012450","034020","105560",
  "000270","035420","329180","068270","055550","035720","015760","012330",
  "009540","028260","402340","042660","011200","086790","032830","064350",
  "138040","005490","000810","267260","316140","010130","259960","051910",
  "323410","024110","096770","010140","006400","018260","033780","003550",
  "030200","066570","352820","377300","017670","079550","003670","034730",
  "272210","000150","006800","086280","009150","003230","042700","047810",
  "267250","443060","003490","000720","047050","010120","090430","180640",
  "298040","071050","010620","000100","005830","000880","326030","005940",
  "021240","016360","010950","032640","241560","039490","278470","009830",
  "029780","051900","006260","001040","251270","161390","034220","028050",
  "078930","271560","011790","052690","004020","454910","097950","175330",
  "138930","302440","036570","035250","003620","001740","402340","011780",
  "073240","066970","023530","005300","011170","280360","004990","004000",
  "004170","009420","300720","069960","008770","298050","298020","352820",
  "128940","008930","018880","018260","003550","033780","035720","323410",
  "377300","030200","033780","011780","073240","066970","032640","011070",
  "079550","079550","024110","071050","006650","006650","010130","003490",
  "259960","030200","033780","011780","073240","066970","280360","023530",
  "004990","011170","004000","009150","018260","016360","003230","137310",
  "001430","003030","004490","055550","004170","034730","326030","302440",
  "285130","000660","361610","096770","001740","402340","017670","011790"
]);

async function fetchItemByCode(code) {
  try {
    const response = await axios.get(API_URL, {
      params: {
        serviceKey: SERVICE_KEY,
        numOfRows: 1,
        pageNo: 1,
        likeSrtnCd: code,
        resultType: 'json'
      },
    });

    const item = response.data?.response?.body?.items?.item?.[0];
    if (item) {
      return {
        name: item.itmsNm,
        codeISIN: item.isinCd,
        code: code
      };
    }
  } catch (err) {
    console.error(`Failed to fetch ${code}:`, err.message);
  }
  return null;
}

async function main() {
  const results = [];
  for (const code of ALL_CODES) {
    const data = await fetchItemByCode(code);
    if (data) results.push(data);
  }

  fs.writeFileSync(path.join(__dirname, 'kospi200.json'), JSON.stringify(results, null, 2));
  console.log(`✔️ Saved ${results.length} companies.`);
}

main();