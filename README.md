# Sistema de Controle de Ponto Eletrônico

## Descrição do Projeto

Este sistema permite o cadastro de funcionários, importação de arquivos AFD (marcação de ponto) e visualização detalhada do espelho de ponto com cálculos de horas trabalhadas, horas normais, extras, faltas, atrasos e adicional noturno.

---

## Funcionalidades Principais

- **Cadastro de Funcionários:**  
  Cadastro completo com validação de CPF, PIS, matrícula, data de admissão e situação do cadastro (Ativo/Inativo). Validações front-end e back-end garantem integridade e unicidade dos dados.

- **Importação de AFD (Arquivos de Fonte de Dados):**  
  Upload e processamento de arquivos AFD nos formatos 1510 e 671. Classificação das marcações em "apropriadas" e "não apropriadas" com base no cadastro ativo de funcionários.

- **Espelho de Ponto:**  
  Exibição detalhada por dia e por funcionário dos cálculos de horas trabalhadas, horas normais, extras, faltas, atrasos e adicional noturno, com base nas marcações válidas importadas.

---

## Tecnologias Utilizadas

- **Frontend:** React.js  
- **Backend:** Spring Boot (Java)  
- **Banco de Dados:** MySQL  
- **Outras dependências:** Axios (frontend), JPA/Hibernate (backend), validações customizadas, máscaras de input para CPF e PIS.

---

## Requisitos para Execução

- **Java JDK 17+**  
- **Maven 3.6+**  
- **Node.js 18+ e npm/yarn**  
- **MySQL 8+ (ou compatível)**

---

## Como Configurar e Rodar o Projeto

### 1. Backend (Spring Boot)

1. Configure seu banco de dados MySQL criando um schema, por exemplo, `controle_ponto`.  
2. No arquivo `application.properties` ou `application.yml`, configure a conexão com o banco de dados:

```
spring.datasource.url=jdbc:mysql://localhost:3306/controle_ponto
spring.datasource.username=seu_usuario
spring.datasource.password=sua_senha
spring.jpa.hibernate.ddl-auto=update
```

3. Navegue até a pasta do backend:

```
cd controle-ponto
```

4. Compile e execute a aplicação:

```
mvn clean spring-boot:run
```

5. A API estará disponível por padrão em `http://localhost:8080/api`.

---

### 2. Frontend (React)

1. Navegue até a pasta do frontend:

```
cd front\frontend-controle-ponto
```

2. Instale as dependências:

```
npm install
```

3. Execute a aplicação:

```
npm start
```

4. O frontend estará rodando em `http://localhost:3000`.

---

## Uso do Sistema

- Acesse o frontend no navegador.  
- Utilize o menu para:  
  - Cadastrar novos funcionários, com validação e feedback visual.  
  - Importar arquivos AFD para processamento das marcações de ponto.  
  - Visualizar o espelho de ponto detalhado por funcionário e período.

---

## Validações e Regras

- CPF e PIS possuem máscaras e validações de formato (CPF: `XXX.XXX.XXX-XX`, PIS: `XXX.XXXXX.XX-X`).  
- CPF, PIS e matrícula são únicos no sistema.  
- Funcionários podem ser marcados como "Ativo" ou "Inativo".  
- Apenas marcações de ponto de funcionários ativos são consideradas apropriadas.  
- Mensagens claras são exibidas em caso de erros no cadastro ou importação.

---

## Estrutura do Projeto

- **backend/** - Código Spring Boot, controllers, services, models, repositórios.  
- **frontend/** - Código React, componentes, páginas, estilos.

