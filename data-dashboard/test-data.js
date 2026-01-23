const xlsx = require('xlsx');
const { join } = require('path');

const publicDir = join(__dirname, 'public', 'data');
const meituanPath = join(publicDir, '美团数据.xlsx');
const elemePath = join(publicDir, '饿了么数据.xlsx');

console.log('Reading 美团数据.xlsx...');
try {
  const meituanWorkbook = xlsx.readFile(meituanPath);
  const meituanSheet = meituanWorkbook.Sheets[meituanWorkbook.SheetNames[0]];
  const meituanData = xlsx.utils.sheet_to_json(meituanSheet);

  console.log(`✓ 美团数据: ${meituanData.length} 行`);
  console.log('第一行数据:', meituanData[0]);
  console.log('最后一行数据:', meituanData[meituanData.length - 1]);

  // 测试字段映射
  const firstRow = meituanData[0];
  console.log('\n字段映射测试:');
  console.log('- 日期:', firstRow['日期']);
  console.log('- 美团解约店铺数:', firstRow['美团解约店铺数']);
  console.log('- 美团总抽点店铺数:', firstRow['美团总抽点店铺数']);
  console.log('- 美团总金额:', firstRow['美团总金额']);
} catch (error) {
  console.error('读取美团数据失败:', error.message);
}

console.log('\n' + '='.repeat(50) + '\n');

console.log('Reading 饿了么数据.xlsx...');
try {
  const elemeWorkbook = xlsx.readFile(elemePath);
  const elemeSheet = elemeWorkbook.Sheets[elemeWorkbook.SheetNames[0]];
  const elemeData = xlsx.utils.sheet_to_json(elemeSheet);

  console.log(`✓ 饿了么数据: ${elemeData.length} 行`);
  console.log('第一行数据:', elemeData[0]);
  console.log('最后一行数据:', elemeData[elemeData.length - 1]);

  // 测试字段映射
  const firstRow = elemeData[0];
  console.log('\n字段映射测试:');
  console.log('- 日期:', firstRow['日期']);
  console.log('- 饿了么解约店铺数:', firstRow['饿了么解约店铺数']);
  console.log('- 饿了么总店铺数:', firstRow['饿了么总店铺数']);
  console.log('- 饿了么总代运营结算金额:', firstRow['饿了么总代运营结算金额']);
} catch (error) {
  console.error('读取饿了么数据失败:', error.message);
}
