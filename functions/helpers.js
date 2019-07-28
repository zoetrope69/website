function humanisedList(list) {
  return list.slice(0, -1).join(', ') + ' and ' + list.slice(-1);
}

module.exports = {
  humanisedList
}