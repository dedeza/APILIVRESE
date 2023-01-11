const jwt = require('jsonwebtoken');

module.exports = (req, res, next)=>{
    try{
        const token = req.headers.authorization.split(' ')[1];
        console.log(token);
        const decode = jwt.verify(token, "segredo");
        req.user = decode;
        next();
    } catch (error){
        return res.status(401).send({mensagem: 'Falha na autenticação', error: error})
    }
}