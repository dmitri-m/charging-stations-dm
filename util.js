const _ = require('lodash');

const { Companies, Stations, StationType } = require("./model");

const onDbError = (res, err) => {
    console.log(err);
    res.status(500).send(err.toString());
}

const dataResponse = (res, data) => data ? res.json(data) : res.sendStatus(404)

const withId = id => ({where: {id}})

/*
const findChildren = async c => Companies.findAll({where: { parentId: c.id }, raw: true}) 

const query = async (children) => {
  if (children && children.length) {
    const head = _.head(children)
    return [head, ...(await query(await findChildren(head))), ...(await query(_.tail(children)))];
  }
  return []
};
*/
const findAllChildren = async id => Companies.findAll({where: { parentId: id }, raw: true}) 

const queryChildrenRecursive = async (children) => {
  if (children && children.length) {
    const head = _.head(children)
    return [head, ...(await queryChildrenRecursive(await findAllChildren(head.id))), ...(await queryChildrenRecursive(_.tail(children)))];
  }
  return []
};

const getChildCompanies = async company => findAllChildren(company)
  .then(queryChildrenRecursive)

const getCompanyStations = async company => getChildCompanies(company)
    .then(list => [company, ...list.map(c => c.id)])
    .then(companies => Stations.findAll({
      where: {companyId: companies}, 
      include:[{model: StationType}],
      raw: true,
      nest: true,
    }))

module.exports = {onDbError, dataResponse, withId, getChildCompanies, getCompanyStations}