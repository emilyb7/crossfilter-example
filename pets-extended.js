if (!console.table) require("console.table");

const crossfilter = require("crossfilter");
const data = require("./people.json");

const cx = crossfilter(data);
const d0 = cx.dimension(() => true);
const d1 = cx.dimension(d => d.name);
const d2 = cx.dimension(d => d.pets.length);
const d3 = cx.dimension(d => d.gender);

const addPets = (acc, { pets }) => ({
  ...acc,
  total: acc.total + pets.length,
  count: acc.count + 1
});

const removePets = (acc, { pets }) => ({
  ...acc,
  total: acc.total - pets.length,
  count: acc.count - 1
});

const initCountPets = () => ({
  total: 0,
  count: 0
});

const printPetDetail = person => ({
  ...person,
  pets: person.pets.length
    ? `${person.pets.length} ${person.pets[0].type}`
    : "No pets :("
});

const filterFemale = dimension => {
  dimension.filter(gender => gender === "F");
  let result = dimension.top(2);
  dimension.filterAll();
  return result;
};

const printAll = ({ top, bottom, female, average }) => {
  // top pet owners
  console.log("[33m%s[0m", "🐶   top 2 by number of pets");
  console.table(top.map(printPetDetail));
  console.log("-------------------");

  // bottom pet owners
  console.log("[35m%s[0m", "🐈    bottom 2 by number of pets");
  console.table(bottom.map(printPetDetail));
  console.log("-------------------");

  // female
  console.log("[33m%s[0m", "🙋‍♀️   top female pet owners");
  console.table(female.map(printPetDetail));

  // average number of pets
  console.log("[33m%s[0m", "🐠  average number of pets by gender");
  console.table(
    average.map(x => ({
      gender: x.key,
      average: x.value.total / x.value.count
    }))
  );
};

printAll({
  top: d2.top(2),
  bottom: d2.bottom(2),
  female: filterFemale(d3),
  average: d3.group().reduce(addPets, removePets, initCountPets).all()
});
