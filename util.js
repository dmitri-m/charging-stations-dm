
const onDbError = (res, err) => {
    console.log(err);
    res.status(500).send(err.toString());
}

const dataResponse = (res, data) => data ? res.json(data) : res.sendStatus(404)

const withId = id => ({where: {id}})
  
module.exports = {onDbError, dataResponse, withId}