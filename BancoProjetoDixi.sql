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

CREATE TABLE marcacao (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    data DATE NOT NULL,
    hora TIME NOT NULL,
    pis VARCHAR(13),
    cpf VARCHAR(13),
    tipo_registro VARCHAR(10),
    origem_arquivo VARCHAR(255),
    apropriada BOOLEAN NOT NULL,
    motivo_rejeicao VARCHAR(255),
    funcionario_id BIGINT,
    FOREIGN KEY (funcionario_id) REFERENCES funcionario(id)
);