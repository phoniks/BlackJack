module.exports = function formatAsMoney(dollars){
  if (typeof dollars !== 'number') throw new Error('expected ('+JSON.stringify(dollars)+') to be a number')
  return '$'+dollars.toFixed(2);
}