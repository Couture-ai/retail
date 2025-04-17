const _pharma = {
  name: 'Pharma',
  roleName: 'pharma',
  sf: 'RA'
};
const _digital = {
  name: 'Digital',
  roleName: 'digital',
  sf: 'DG'
};
const _roleAppMap = {
  admin: [_pharma, _digital],
  pharma: [_pharma],
  digital: [_digital]
};
export default _roleAppMap;
