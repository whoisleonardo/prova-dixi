create database controle_ponto;
use controle_ponto;

CREATE TABLE funcionario (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    nome_completo VARCHAR(100) NOT NULL,
    cpf VARCHAR(14) UNIQUE,
    pis VARCHAR(13) UNIQUE,
    matricula VARCHAR(15) UNIQUE NOT NULL,
    data_admissao DATE NOT NULL,
    situacao_cadastro VARCHAR(10) NOT NULL
);

TRUNCATE TABLE funcionario;

select * from funcionario;