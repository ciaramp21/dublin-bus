{/* A funtion to return the unique values in the Route_data.json file.*/}
function getUnique(routeData, comp) {

    const unique =  routeData.map(e => e[comp])

      // store the indexes of the unique objects
      .map((e, i, final) => final.indexOf(e) === i && i)

      // eliminate the false indexes & return unique objects
     .filter((e) => routeData[e]).map(e => routeData[e]);
    return unique;
}
