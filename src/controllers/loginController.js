const bcrypt = require('bcrypt');

function login(req, res){
    if(req.session.loggedin != true){
        res.render('login/index')
    } else{
        res.redirect('/')
    }
}
function auth(req, res){
    const data = req.body;
    req.getConnection((err,conn)=>{
        conn.query('select * from empleado where empUsuario = ?', [data.empUsuario], (err, userdata)=>{
            if(userdata.length>0){
                userdata.forEach(element => {
                    bcrypt.compare(data.empContraseña, element.empContraseña, (err, isMatch)=>{
                        if(!isMatch){
                             res.render('login/index', {error: 'Error: incorrect password'});
                         } else{
                             req.session.loggedin = true;
                             req.session.name = element.name;
                             res.redirect('/')
                         }
                     });
                });
            }else{
                res.render('login/index', {error: 'error: user not exits'});
            }
        });
    });
}
function register(req, res){
    if(req.session.loggedin != true){
        res.render('login/register')
    } else{
        res.redirect('/')
    }
}

function storeUser(req,res){
    const data = req.body;
    req.getConnection((err,conn)=>{
        conn.query('select * from empleado where empUsuario = ?', [data.empUsuario], (err, userdata)=>{
            if(userdata.length>0){
                res.render('login/register', {error: 'error: user already exits'})
            }else{
                bcrypt.hash(data.empContraseña,12).then(hash =>{
                    data.empContraseña = hash;        
                    req.getConnection((err,conn) =>{
                        conn.query('Insert into entregafinal.empleado set?',[data],(err,rows)=>{
                            res.redirect('/');
                        })
                    });
                });
            }
        })
    })
}

function logout(req, res) {
    if (req.session.loggedin) {
      req.session.destroy();
    }
    res.redirect('/');
  }
module.exports = {
    login, 
    register,
    storeUser, 
    auth,
    logout,
}