const generarID = () => {
 const random1 = Math.random()
                    .toString(32)
                    .substring(2);

const random2 = Date.now().toString(32)

return random1 + random2

}

export default generarID