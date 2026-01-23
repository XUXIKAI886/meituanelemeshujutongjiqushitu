const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

function parseExcelFile(filePath, platform) {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(worksheet);

    return jsonData
      .map((row) => {
        let dateStr = '';
        if (row['日期']) {
          const dateValue = row['日期'];
          if (typeof dateValue === 'number') {
            const date = xlsx.SSF.parse_date_code(dateValue);
            dateStr = `${date.y}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`;
          } else {
            dateStr = String(dateValue);
          }
        }

        let cancellations = 0;
        let commissionStores = 0;
        let totalRevenue = 0;

        if (platform === '美团') {
          cancellations = Number(row['美团解约店铺数'] || 0);
          commissionStores = Number(row['美团总抽点店铺数'] || 0);
          totalRevenue = Number(row['美团总金额'] || 0);
        } else if (platform === '饿了么') {
          cancellations = Number(row['饿了么解约店铺数'] || 0);
          commissionStores = Number(row['饿了么总店铺数'] || 0);
          totalRevenue = Number(row['饿了么总代运营结算金额'] || 0);
        }

        return { date: dateStr, cancellations, commissionStores, totalRevenue };
      })
      .filter((item) => item.date);
  } catch (error) {
    console.error(`读取${platform}数据失败:`, error);
    return [];
  }
}

function findExcelFile(fileName) {
  const cwd = process.cwd();
  const candidates = [
    path.join(cwd, fileName),
    path.join(cwd, 'public', 'data', fileName),
    path.join(cwd, '..', fileName),
  ];

  for (const p of candidates) {
    if (fs.existsSync(p)) {
      console.log(`找到文件: ${p}`);
      return p;
    }
  }
  throw new Error(`未找到数据文件：${fileName}`);
}

function main() {
  console.log('开始生成静态数据...');

  const meituanPath = findExcelFile('美团数据.xlsx');
  const elemePath = findExcelFile('饿了么数据.xlsx');

  const meituanData = parseExcelFile(meituanPath, '美团');
  const elemeData = parseExcelFile(elemePath, '饿了么');

  const output = [
    { platform: '美团', data: meituanData },
    { platform: '饿了么', data: elemeData },
  ];

  const outputDir = path.join(process.cwd(), 'public', 'data');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, 'platform-data.json');
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf-8');

  console.log(`数据已生成: ${outputPath}`);
  console.log(`美团数据: ${meituanData.length} 条`);
  console.log(`饿了么数据: ${elemeData.length} 条`);
}

main();
