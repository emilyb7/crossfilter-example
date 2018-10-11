const crossfilter = require("crossfilter");
require("console.table");

const data = [
  {
    name: "Emily",
    gender: "F",
    pets: []
  },
  {
    name: "Mike",
    gender: "M",
    pets: []
  },
  {
    name: "Will",
    gender: "M",
    pets: [{ type: "cat", age: 7, name: "Joanne" }]
  },
  {
    name: "Lewi",
    gender: "M",
    pets: [{ type: "cat", age: 1, name: "Sunny" }]
  }
];

const identity = a => a;

const cx = crossfilter(data);

const d0 = cx.dimension(() => true);
const d1 = cx.dimension(d => d.name);
const d2 = cx.dimension(d => d.pets.length);
const d3 = cx.dimension(d => d.gender);

(function() {
  const extendPets = obj => ({
    ...obj,
    pets: obj.pets.length
      ? `${obj.pets.length} ${obj.pets[0].type}`
      : "No pets :("
  });
  console.log("[33m%s[0m", "🍉 top 2 by number of pets");
  console.table(d2.top(2).map(extendPets));
  console.log("-------------------");
  console.log("[35m%s[0m", "☕️ bottom 2 by number of pets");
  console.table(d2.bottom(2).map(extendPets));

  // filtering
  d3.filter(gender => gender === "F");
  console.log("[33m%s[0m", "🥦   top female pet owners");
  console.table(d2.top(1).map(extendPets));
  d3.filterAll();
  console.log("-------------------");

  // aggregations
  const init = () => ({
    total: 0,
    count: 0
  });

  const add = (a, { pets }) => ({
    ...a,
    total: a.total + pets.length,
    count: a.count + 1
  });

  const remove = (a, { pets }) => ({
    ...a,
    total: a.total - pets.length,
    count: a.count - 1
  });
  console.log("[33m%s[0m", "🦁 average number of pets");
  console.table(
    d3
      .group()
      .reduce(add, remove, init)
      .all()
      .map(x => ({ gender: x.key, average: x.value.total / x.value.count }))
  );
})();
