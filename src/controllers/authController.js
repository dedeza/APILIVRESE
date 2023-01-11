const express = require('express');
const mysql = require('../../mysql').pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
    async login (req, res, next){
        mysql.getConnection((err, conn)=>{
            if(err){
                return  res.status(500).send(err);
            }
            conn.query(
                'SELECT * FROM users WHERE email = ?',
                [req.body.email],
                (error, result) => {
                    conn.release();
                    if(error){
                        return  res.status(500).send(error);
                    }
                    if(result.length < 1){
                        return res.status(401).send({mensagem: 'Falha na autenticação'})
                    }
                    bcrypt.compare(req.body.senha, result[0].senha, (errBcrypt, resultBcrypt)=>{
                        if(errBcrypt){
                            return res.status(401).send({mensagem: 'Falha na autenticação'})
                        }
                        if(resultBcrypt){
                            console.log(result);
                            const token = jwt.sign({
                                id: result[0].id,
                                email: result[0].email,
                                nome: result[0].nome,
                                sobrenome: result[0].sobrenome,
                                tel: result[0].tel
                            }, 'segredo', {
                                expiresIn: '7d'
                            })
                            return res.status(200).send({
                                mensagem: 'Autenticado com sucesso',
                                token: token
                        })
                        }
    
                        return res.status(401).send({mensagem: 'Falha na autenticação'});
                    })
                   
                }
                )
        })
       
        
    },
    async cadastro (req, res, next){
        mysql.getConnection((err, conn)=>{
            if(err){
                return  res.status(500).send(err);
            }
            conn.query(`SELECT * FROM users WHERE email = ?`, [req.body.email], (error, results)=>{
                conn.release();
                if(error){return res.status(500).send({error: error})}
                if(results.length > 0){
                    return res.status(409).send({mensagem: 'email já cadastrado'})
                }
                else {
    
                    bcrypt.hash(req.body.senha, 10, (errBcrypt, hash) => {
                        if(errBcrypt){
                            return res.status(500).send({error: errBcrypt})
                        }
            
                        conn.query(
                            `INSERT INTO users (nome, sobrenome, email, tel, senha) VALUES (?,?,?,?,?)`,
                            [req.body.nome, req.body.sobrenome, req.body.email, req.body.tel, hash],
                            (error, result)=>{
                                conn.release();
                                if(error){return res.status(500).send({error: error })}
            
                                return res.status(201).send({
                                    mensagem: 'usuario criado com sucesso!',
                                    user: {
                                        user_id: result.insertId,
                                        email: req.body.email
                                    }
                                })
            
                            }
                            )
                    })
    
                }
            })
           
    
        })
        
    }
};