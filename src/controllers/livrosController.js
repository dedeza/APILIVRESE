const express = require('express');
const mysql = require('../../mysql').pool;


module.exports = {
    async create(req, res, next){
        mysql.getConnection((err, conn)=>{
            if(err){
                return res.status(500).send({error: err})
            }
            conn.query(
                `INSERT INTO livros (titulo, categoria, descricao, ano_lancamento, autor, foto, isReservado, id_user) VALUES (?,?,?,?,?,?,?,?)`,
                [req.body.titulo, req.body.categoria, req.body.descricao, req.body.ano_lancamento, req.body.autor, req.file.path,  false,  req.user.id],
                (error, result)=>{
                    conn.release();
                    if(error){return res.status(500).send({error: error })}

                    return res.status(201).send({
                        mensagem: 'livro criado com sucesso!',
                        livro: {
                            id_livro: result.insertId,
                            titulo: req.body.titulo
                        }
                    })

                }
                )
        })
    },
    async read(req, res, next){
        mysql.getConnection((err, conn)=>{
            if(err){
                return res.status(500).send({error: err})
            }
            conn.query(
                `SELECT * FROM livros`,
                (error, result)=>{
                    conn.release();
                    if(error){return res.status(500).send({error: error })}

                    return res.status(201).send({
                      livros: result
                    })

                }
                )
        })



    },
    async CategoryFilterRead(req, res, next){
        mysql.getConnection((err, conn)=>{
            if(err){
                return res.status(500).send({error: err})
            }
            conn.query(
                `SELECT * FROM livros WHERE categoria = ?`,
                [req.params.categoria],
                (error, result)=>{
                    conn.release();
                    if(error){return res.status(500).send({error: error })}

                    return res.status(201).send({
                      livros: result
                    })

                }
                )
        })


    },
    async myRead(req, res, next){
        mysql.getConnection((err, conn)=>{
            if(err){
                return res.status(500).send({error: err})
            }
            conn.query(
                `SELECT * FROM livros WHERE id_user = ?`,
                [req.user.id],
                (error, result)=>{
                    conn.release();
                    if(error){return res.status(500).send({error: error })}

                    return res.status(201).send({
                      livros: result
                    })

                }
                )
        })

    }
}