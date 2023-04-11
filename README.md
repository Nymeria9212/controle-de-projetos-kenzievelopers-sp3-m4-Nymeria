# **Controle de projetos - KenzieVelopers**

## **Introdução**

Uma startup de tecnologia e desenvolvimento web decidiu criar uma API Rest para gerenciar seus desenvolvedores e projetos. Como você é um dos novos integrantes da equipe, você foi o escolhido para desenvolver essa aplicação.

Através dessa API deve ser possível realizar o registro do desenvolvedor, associar informações extras ao mesmo, registrar projetos e associar as tecnologias utilizadas nesses projetos e por fim adicionar projetos aos seus respectivos desenvolvedores.

A seguir estarão todas as regras de negócio definidas pela startup para esse projeto. Lembre-se de seguir à risca todas as regras impostas.

Vamos lá?!

#

## **Regras da entrega**

A entrega deve seguir as seguintes regras:

- O código deve estar em TypeScript, caso não esteja a **entrega será zerada**;
- Deverá ser utilizado um banco de dados **_postgres_** para a elaboração da API;
- O nome da tabela, das colunas e demais especificações, devem ser seguidas **à risca**. Caso tenha divergência, **será descontado nota**;
- **Tenha muita atenção sobre o nome das chaves nos objetos de entrada e saída de cada requisição**;
- **Na raiz do diretório** deve-se conter uma pasta nomeada **sql**, com dois arquivos:

  - **createTables.sql**: contendo as queries de criação e inserção das tabelas e type;
  - **diagram.png/jpg**: um arquivo **_.png_** ou **_.jpg_** contendo o diagrama da tabela;
  - caso o arquivo **_createTables.sql_** não exista, **a entrega será zerada**.

- **Essa entrega possui testes automatizados**;
- Para que os testes possam ser executados, existe um script de limpeza do banco que utiliza as queries do arquivo createTables.sql para ser executado, por isso é importante seguir as orientações sobre subdiretório sql e seus arquivos à risca.

  - Caso o subdiretório sql e o arquivo createTables.sql não estejam com os nomes corretos ou no caminho correto os testes falharão, pois não será possível encontrar as queries a serem executadas;
  - Caso o nome de alguma tabela, tipo ou coluna não esteja de acordo com o esperado, os testes também falharão.

- A organização dos demais arquivos e pastas deve seguir o que foi visto previamente.

### AVISO

Os testes não devem ser alterados em nenhum momento da aplicação, caso tenha sido feito alguma alteração nos testes, a entrega será zerada. 

- Para rodar os testes precisa modificar a variavel de ambiente para test: **NODE_ENV="test"**
- Para rodar a aplicação precisa popular as variaveis de ambiente, que irá encontrar no env.exemple:
    - Tanto as com sufixo test (DB_TEST, DB_TEST_USER...) para conseguir utilizar o comando npm run test. 
    - Quanto as demais (DB, DB_USER...)para conseguir utilizar o comando npm run dev 
    - Aconselhamos criar dois bancos de dados um para o debug e outro para testes. 
- Não altere os arquivos: 
  - jest.config
  - configTestsDatabase.ts
  - __tests__
  - server.ts
- Não remova o que está dentro do package.json, apenas adicione as libs que irá necessitar utilizar, caso elas já não estejam instaladas. 
- Para rodar os testes utilize o comando: **npm run test**
- Caso queria rodar uma bateria de testes especificos pode utilizar:
  - npm run test <arquivo teste que está dentro de __testes__>
  - **Exemplo**: npm run test createDeveloper.test


## **Tabelas do banco de dados**

### **Tabela developers**

- Nome da tabela: **_developers_**.
- Colunas:
  - **id**: número, incrementação automática e chave primária.
  - **name**: string, tamanho 50 e obrigatório.
  - **email**: string, tamanho 50, obrigatório e único.

### **Tabela developer_infos**

- Nome da tabela: **_developer_infos_**.
- Colunas:
  - **id**: número, incrementação automática e chave primária.
  - **developerSince**: data e obrigatório.
  - **preferredOS**: OS e obrigatório.
  - **developerId**: inteiro, único, obrigatório e chave estrangeira.
- Especificações:
  - O campo preferredOS deve aceitar apenas os valores: Windows, Linux e MacOS.
  - O tipo OS deve ser feito usando um ENUM.

### **Tabela projects**

- Nome da tabela: **_projects_**.
- Colunas:
  - **id**: número, incrementação automática e chave primária.
  - **name**: string, tamanho 50 e obrigatório.
  - **description**: texto.
  - **estimatedTime**: string, tamanho 20 e obrigatório.
  - **repository**: string, tamanho 120 e obrigatório.
  - **startDate**: data e obrigatório.
  - **endDate**: data.
  - **developerId**: inteiro e chave estrangeira.

### **Tabela technologies**

- Nome da tabela: **_technologies_**.
- Colunas:
  - **id**: número, incrementação automática e chave primária.
  - **name**: string, tamanho 30 e obrigatório.
- Especificações:
  - As tecnologias devem ser inseridas no banco via query, no momento da criação da tabela. Não há uma rota específica para realizar essas inserções.
  - Se atentem às nomenclaturas das tecnologias, pois qualquer erro poderá desencadear falhas nos testes e consequente desconto em sua nota.
- Lista de tecnologias:
  - JavaScript
  - Python
  - React
  - Express.js
  - HTML
  - CSS
  - Django
  - PostgreSQL
  - MongoDB

### **Tabela projects_technologies**

- Nome da tabela: **_projects_technologies_**.
- Colunas:
  - **Id**: número, incrementação automática e chave primária.
  - **addedIn**: data e obrigatório.
  - **technologyId**: inteiro, obrigatório e chave estrangeira.
  - **projectId**: inteiro, obrigatório e chave estrangeira.

#

## **Relacionamentos**

### **developers e developer_infos**

- Um desenvolvedor pode ter apenas uma informação adicional, assim como, uma informação adicional pode pertencer a apenas um desenvolvedor.
- Caso o **_developer_** seja deletado, a **_developer info_** ligada a ele deve ser **deletada** automaticamente.

### **developers e projects**

- Um desenvolvedor pode ter muitos projetos, porém, um projeto pode pertencer a apenas um desenvolvedor.
- Caso um **_developer_** seja deletado, a coluna **_developerId_** do projeto associado deve ser automaticamente alterada para **NULL**.

### **projects e projects_technologies**

- Um projeto pode ter múltiplas tecnologias e uma tecnologia pode pertencer a vários projetos.
- Caso um **projeto** ou uma **tecnologia** sejam **deletados**, os **dados associados** na tabela **_projects_technologies_** devem ser **deletados automaticamente**.

#

## **Rotas - /developers**

## Endpoints

| Método | Endpoint              | Responsabilidade                                    |
| ------ | --------------------- | --------------------------------------------------- |
| POST   | /developers           | Cadastrar um novo desenvolvedor                     |
| GET    | /developers/:id       | Listar um desenvolvedor e seus projetos             |
| PATCH  | /developers/:id       | Atualizar os dados de um desenvolvedor              |
| DELETE | /developers/:id       | Remover um desenvolvedor                            |
| POST   | /developers/:id/infos | Cadastrar informações adicionais a um desenvolvedor |

#

## Regras da aplicação

### **POST /developers**

- Deve ser possível criar um developer enviando apenas **_name_** e **_email_** através do corpo da requisição;
  - ambos devem ser uma string;
- Não deve ser possível cadastrar um developer enviando um email já cadastrado no banco de dados.

- **Sucesso**:
  - Body esperado: um objeto contendo os dados do developer cadastrado
  - Status esperado: _201 CREATED_
- **Falha**:

  - Caso: email já cadastrado no banco
    - Body esperado: um objeto contendo a chave **_message_** com uma mensagem adequada;
    - Status esperado: _409 CONFLICT_.

- **Exemplos de retornos**:
  | Dados de entrada: |
  | ----------------- |
  | Body: Formato Json |

  ```json
  {
    "email": "fabio.jr@kenzie.com.br",
    "name": "Fabio"
  }
  ```

  - Criando um developer com sucesso:

    | Resposta do servidor:      |
    | -------------------------- |
    | Body: Formato Json         |
    | Status code: _201 CREATED_ |

    ```json
    {
      "id": 1,
      "name": "Fabio",
      "email": "fabio.jr@kenzie.com.br"
    }
    ```

  - Tentando cadastrar com um email existente:

    | Resposta do servidor:       |
    | --------------------------- |
    | Body: Formato Json          |
    | Status code: _409 CONFLICT_ |

    ```json
    {
      "message": "Email already exists."
    }
    ```

#

### **GET /developers/:id**

- Através do id de um desenvolvedor, deve retornar um array de objetos contendo dados das seguintes tabelas:

  - **_developers_**;
  - **_developer_infos_**;
  - **_projects_**.

- Os dados devem ser retornados exatamente como definidos aqui. Você pode usar apelidos (alias) para realizar essa tarefa:

  - **developerId**: tipo **_number_**;
  - **developerName**: tipo **_string_**;
  - **developerEmail**: tipo **_string_**;
  - **developerInfoDeveloperSince**: tipo **_Date_** ou **_null_**;
  - **developerInfoPreferredOS**: tipo **_string_** ou **_null_**;

- **Sucesso**:
  - Body esperado: um array de objetos contendo os dados mesclados das tabelas _developers_, _developer_infos_ e _projects_;
  - Status esperado: _200 OK_;
- **Falha**:

  - Caso: id informado não pertence à nenhum developer cadastrado
    - Body esperado: um objeto contendo a chave **_message_** com uma mensagem adequada;
    - Status esperado: _404 NOT FOUND_.

- **Exemplos de retornos**:

  - Listando um developer com sucesso:

    | Resposta do servidor: |
    | --------------------- |
    | Body: Formato Json    |
    | Status code: _200 OK_ |
    |                       |

    ```json
    {
      "developerId": 1,
      "developerName": "Fabio",
      "developerEmail": "fabio.senior@kenzie.com.br",
      "developerInfoDeveloperSince": "2013-01-01T02:00:00.000Z",
      "developerInfoPreferredOS": "MacOS"
    }
    ```

  - Tentando listar com um id inexistente:

    | Resposta do servidor:        |
    | ---------------------------- |
    | Body: Formato Json           |
    | Status code: _404 NOT FOUND_ |

    ```json
    {
      "message": "Developer not found."
    }
    ```

#

### **PATCH /developers/:id**

- Através do id de um desenvolvedor, deve ser possível atualizar os dados de _email_ e _name_.
- O retorno deverá ser um objeto contendo todos os dados do developer, depois da atualização ter sido realizada.
- **Sucesso**:

  - Body esperado: um objeto podendo conter _email_ e _name_;
  - Status esperado: _200 OK_.

- **Falha**:

  - Caso: id informado não pertence à nenhum developer cadastrado

    - Body esperado: um objeto contendo a chave **_message_** com uma mensagem adequada;
    - Status esperado: _404 NOT FOUND_.

  - Caso: email já cadastrado no banco

    - Body esperado: um objeto contendo a chave **_message_** com uma mensagem adequada;
    - Status esperado: _409 CONFLICT_.

- **Exemplos de retornos**:
  | Dados de entrada: |
  | ----------------- |
  | Body: Formato Json |

  ```json
  {
    "email": "fabio.senior@kenzie.com.br",
    "name": "Fabio Senior"
  }
  ```

  - Atualizando um developer com sucesso:

    | Resposta do servidor: |
    | --------------------- |
    | Body: Formato Json    |
    | Status code: _200 OK_ |
    |                       |

    ```json
    {
      "id": 1,
      "email": "fabio.senior@kenzie.com.br",
      "name": "Fabio Senior"
    }
    ```

  - Tentando cadastrar com um email existente:

    | Resposta do servidor:       |
    | --------------------------- |
    | Body: Formato Json          |
    | Status code: _409 CONFLICT_ |

    ```json
    {
      "message": "Email already exists."
    }
    ```

  - Tentando listar com um id inexistente:

    | Resposta do servidor:        |
    | ---------------------------- |
    | Body: Formato Json           |
    | Status code: _404 NOT FOUND_ |

    ```json
    {
      "message": "Developer not found."
    }
    ```

#

### **DELETE /developers/:id**

- Deve ser possível deletar um developer informando apenas seu _id_;

- **Sucesso**:
  - Body esperado: nenhum. Não deve retornar nenhum body;
  - Status esperado: _204 NO CONTENT_
- **Falha**:

  - Caso: id informado não pertence à nenhum developer cadastrado
    - Body esperado: um objeto contendo a chave **_message_** com uma mensagem adequada;
    - Status esperado: _404 NOT FOUND_.

- **Exemplos de retornos**:

  - Deletando um developer com sucesso:
    | Resposta do servidor: |
    | ---------------------------- |
    | Body: nenhum body |
    | Status code: _204 NO CONTENT_ |

    ```json

    ```

  - Tentando deletar com um id inexistente:

    | Resposta do servidor:        |
    | ---------------------------- |
    | Body: Formato Json           |
    | Status code: _404 NOT FOUND_ |

    ```json
    {
      "message": "Developer not found."
    }
    ```

#

### **POST /developers/:id/infos**

- Deve ser possível inserir uma informação adicional a um developer informando seu _id_;
- Deve ser possível inserir os dados _developerSince_ e _preferedOS_;
  - _developerSince_ deve ser uma data;
  - _preferedOS_ deve ser apenas um dos três tipos possíveis:
    - Windows
    - Linux
    - MacOS
- **Sucesso**:
  - Body esperado: objeto contendo as seguintes chaves:
    - **id**: tipo **_number_**
    - **developerSince**: tipo **_Date_**, formato americano YYYY-MM-DD.
    - **preferredOS**: tipo **_string_**
    - **developerId**: tipo **_number_**
  - Status esperado: _201 CREATED_
- **Falha**:
  - Caso: developer com id informado já contém uma informação adicional:
    - Body esperado: um objeto contendo a chave **_message_** com uma mensagem adequada;
    - Status esperado: _409 CONFLICT_.
  - Caso: preferedOS informado não é um dos três permitidos:
    - Body esperado: um objeto contendo a chave **_message_** com uma mensagem adequada e uma chave **_options_** sendo um array contendo as três opções possíveis;
    - Status esperado: _400 BAD REQUEST_.
  - Caso: id informado não pertence à nenhum developer cadastrado
    - Body esperado: um objeto contendo a chave **_message_** com uma mensagem adequada;
    - Status esperado: _404 NOT FOUND_.
- **Exemplos de retornos**:
  | Dados de entrada: |
  | ----------------- |
  | Body: Formato Json |

  ```json
  {
    "developerSince": "2013-01-01",
    "preferredOS": "MacOS"
  }
  ```

  - Criando uma informação adicional com sucesso:
    | Resposta do servidor: |
    | ---------------------------- |
    | Body: Formato Json |
    | Status code: _201 CREATED_ |

    ```json
    {
      "id": 1,
      "developerSince": "2013-01-01T02:00:00.000Z",
      "preferredOS": "MacOS",
      "developerId": 1
    }
    ```

  - Tentando cadastrar informação à um developer que já possui:

    | Resposta do servidor:       |
    | --------------------------- |
    | Body: Formato Json          |
    | Status code: _409 CONFLICT_ |

    ```json
    {
      "message": "Developer infos already exists."
    }
    ```

  - Tentando cadastrar informação com um preferedOS inválido:
    | Dados de entrada: |
    | ----------------- |
    | Body: Formato Json |

    ```json
    {
      "developerSince": "10/02/2018",
      "preferedOS": "Other OS"
    }
    ```

    | Resposta do servidor:          |
    | ------------------------------ |
    | Body: Formato Json             |
    | Status code: _400 BAD REQUEST_ |

    ```json
    {
      "message": "Invalid OS option.",
      "options": ["Windows", "Linux", "MacOS"]
    }
    ```

  - Tentando cadastrar informação com um developer id inválido:

    | Resposta do servidor:        |
    | ---------------------------- |
    | Body: Formato Json           |
    | Status code: _404 NOT FOUND_ |

    ```json
    {
      "message": "Developer not found."
    }
    ```

#

## **Rota - /projects**

## Endpoints

| Método | Endpoint                         | Responsabilidade                         |
| ------ | -------------------------------- | ---------------------------------------- |
| POST   | /projects                        | Cadastrar um novo projeto                |
| GET    | /projects/:id                    | Listar um projeto pelo id                |
| PATCH  | /projects/:id                    | Atualizar um projeto                     |
| DELETE | /projects/:id                    | Excluir um projeto                       |
| POST   | /projects/:id/technologies       | Cadastrar uma tecnologia para um projeto |
| DELETE | /projects/:id/technologies/:name | Deletar uma tecnologia de um projeto     |

## Regras da aplicação

### **POST - /projects**

- Deve ser possível cadastrar um novo projeto enviando os seguintes dados:
  - **name**: tipo **_string_**
  - **description**: tipo **_string_**
  - **estimatedTime**: tipo **_string_**
  - **repository**: tipo **_string_**
  - **startDate**: tipo **_Date_**, formato americano YYYY-MM-DD.
  - **endDate**: tipo **_Date_**, formato americano YYYY-MM-DD.
  - **developerId**: tipo **_number_**
- No body de retorno, caso o _endDate_ não seja enviado na criação, deve ser retornado um _null_;
- **Sucesso**:
  - Body esperado: objeto contendo todos o dados do projeto criado;
  - Status esperado: _201 CREATED_
- **Falha**:
  - Caso: developerId não pertence à um developer cadastrado
    - Body esperado: um objeto contendo a chave **_message_** com uma mensagem adequada;
    - Status esperado: _404 NOT FOUND_.
- **Exemplos**:
  | Dados de entrada: |
  | ----------------- |
  | Body: Formato Json |

  ```json
  // sem endDate
  {
    "name": "Projeto 1",
    "description": "Projeto fullstack",
    "estimatedTime": "2 dias",
    "repository": "url.com.br",
    "startDate": "2023-12-02",
    "developerId": 1
  }

  // com endDate
  {
    "name": "Projeto 2",
    "description": "Projeto backend",
    "estimatedTime": "2 dias",
    "repository": "url.com.br",
    "startDate": "2023-12-10",
    "endDate": "2023-12-23",
    "developerId": 1
  }
  ```

  - Criando um projeto com sucesso:
    | Resposta do servidor: |
    | ---------------------------- |
    | Body: Formato Json |
    | Status code: _201 CREATED_ |

    ```json
    // sem endDate no body de envio
    {
      "id": 1,
      "name": "Projeto 1",
      "description": "Projeto fullstack",
      "estimatedTime": "2 dias",
      "repository": "url.com.br",
      "startDate": "2023-12-02T03:00:00.000Z",
      "endDate": null,
      "developerId": 1
    }

    // com endDate no body de envio
    {
      "id": 2,
      "name": "Projeto 2",
      "description": "Projeto backend",
      "estimatedTime": "2 dias",
      "repository": "url.com.br",
      "startDate": "2023-12-10T03:00:00.000Z",
      "endDate": "2023-12-23T03:00:00.000Z",
      "developerId": 1
    }
    ```

  - Tentando criar com um developerId inválido:
    | Resposta do servidor: |
    | ---------------------------- |
    | Body: Formato Json |
    | Status code: _404 NOT FOUND_ |

    ```json
    {
      "message": "Developer not found."
    }
    ```

#

### **GET - /projects/:id**

- Deve ser possível retornar os dados de um _project_ a partir do _id_ desse projeto;
- O retorno deve ser um array de objetos e cada objeto deve retornar os dados da tabela **_technologies_projects_**
- Cada objeto deve conter as seguintes chaves:

  - **projectId**
  - **projectName**
  - **projectDescription**
  - **projectEstimatedTime**
  - **projectRepository**
  - **projectStartDate**
  - **projectEndDate**
  - **projectDeveloperId**
  - **technologyId** (esse dado pode ser nulo)
  - **technologyName** (esse dado pode ser nulo)

- **Sucesso**:
  - Body esperado: array de objetos contendo todos os dados relacionados ao projeto e suas tecnologias;
  - Status esperado: _200 OK_
- **Falha**:
  - Caso: project id não pertence a um project cadastrado
    - Body esperado: um objeto contendo a chave **_message_** com uma mensagem adequada;
    - Status esperado: _404 NOT FOUND_.
- **Exemplos**:

  - Criando um projeto com sucesso:
    | Resposta do servidor: |
    | ---------------------------- |
    | Body: Formato Json |
    | Status code: _201 CREATED_ |

    ```json
    [
      {
        "projectId": 1,
        "projectName": "Projeto 1",
        "projectDescription": "Projeto fullstack",
        "projectEstimatedTime": "4 meses",
        "projectRepository": "url.com.br",
        "projectStartDate": "2023-12-02T03:00:00.000Z",
        "projectEndDate": "2023-12-10T03:00:00.000Z",
        "projectDeveloperId": 1,
        "technologyId": 1,
        "technologyName": "JavaScript"
      },
      {
        "projectId": 1,
        "projectName": "Projeto 1",
        "projectDescription": "Projeto fullstack",
        "projectEstimatedTime": "4 meses",
        "projectRepository": "url.com.br",
        "projectStartDate": "2023-12-02T03:00:00.000Z",
        "projectEndDate": "2023-12-10T03:00:00.000Z",
        "projectDeveloperId": 1,
        "technologyId": 9,
        "technologyName": "MongoDB"
      }
    ]
    ```

  - Tentando listar com um project id inválido:
    | Resposta do servidor: |
    | ---------------------------- |
    | Body: Formato Json |
    | Status code: _404 NOT FOUND_ |

    ```json
    {
      "message": "Project not found."
    }
    ```

#

### **PATCH - /projects/:id**

- Deverá ser possível atualizar todos os dados de um projeto com exceção do _id_;
- Todos os dados permitidos para atualização devem ser opicionais no envio;
- **Sucesso**:
  - Body esperado: objeto contendo todos os dados do projeto que foi atualizado;
  - Status esperado: _200 OK_
- **Falha**:
  - Caso: project id informado na url não pertence à um projeto cadastrado
    - Body esperado: um objeto contendo a chave **_message_** com uma mensagem adequada;
    - Status esperado: _404 NOT FOUND_.
  - Caso: developerId informado no body não pertence à um developer cadastrado
    - Body esperado: um objeto contendo a chave **_message_** com uma mensagem adequada;
    - Status esperado: _404 NOT FOUND_.
- **Exemplos**:
  | Dados de entrada: |
  | ----------------- |
  | Body: Formato Json |

  ```json
  {
    "name": "Novo nome",
    "description": "Nova descrição",
    "estimatedTime": "1 dia",
    "repository": "novaurl.com.br",
    "startDate": "2023-11-22",
    "developerId": 2
  }
  ```

  - Atualizando um projeto com sucesso:
    | Resposta do servidor: |
    | ---------------------------- |
    | Body: Formato Json |
    | Status code: _200 OK_ |

  ```json
  {
    "id": 1,
    "name": "Novo nome",
    "description": "Nova descrição",
    "estimatedTime": "1 dia",
    "repository": "novaurl.com.br",
    "startDate": "2023-11-22",
    "developerId": 2
  }
  ```

  - Tentando atualizar com um project id inválido:
    | Resposta do servidor: |
    | ---------------------------- |
    | Body: Formato Json |
    | Status code: _404 NOT FOUND_ |

    ```json
    {
      "message": "Project not found."
    }
    ```

  - Tentando atualizar com um developerId inválido:
    | Dados de entrada: |
    | ----------------- |
    | Body: Formato Json |

    ```json
    {
      "developerId": 9999
    }
    ```

    | Resposta do servidor:        |
    | ---------------------------- |
    | Body: Formato Json           |
    | Status code: _404 NOT FOUND_ |

    ```json
    {
      "message": "Developer not found."
    }
    ```

#

### **DELETE - /projects/:id**

- Deve ser possível deletar um projeto especificando seu id;

- **Sucesso**:
  - Body esperado: nenhum. Não deve retornar nenhum body;
  - Status esperado: _204 NO CONTENT_
- **Falha**:

  - Caso: id informado não pertence à nenhum project cadastrado
    - Body esperado: um objeto contendo a chave **_message_** com uma mensagem adequada;
    - Status esperado: _404 NOT FOUND_.

- **Exemplos de retornos**:

  - Deletando um developer com sucesso:
    | Resposta do servidor: |
    | ---------------------------- |
    | Body: nenhum body |
    | Status code: _204 NO CONTENT_ |

    ```json

    ```

  - Tentando deletar com um id inexistente:

    | Resposta do servidor:        |
    | ---------------------------- |
    | Body: Formato Json           |
    | Status code: _404 NOT FOUND_ |

    ```json
    {
      "message": "Project not found."
    }
    ```

#

### **POST - /projects/:id/technologies**

- Deve ser possível adicionar uma tecnologia existente na tabela _technologies_ a um projeto, informando o _id_ do projeto através da _url_ e o _name_ da tecnologia através do body;
- O objeto de retorno deve conter as seguintes chaves:

  - **technologyId**
  - **technologyName**
  - **projectId**
  - **projectName**
  - **projectDescription**
  - **projectEstimatedTime**
  - **projectRepository**
  - **projectStartDate**
  - **projectEndDate**

- **Sucesso**:
  - Body esperado: objeto contendo os dados de retorno esperados;
  - Status esperado: _201 CREATED_
- **Falha**:

  - Caso: project id informado não pertence à nenhum project cadastrado
    - Body esperado: um objeto contendo a chave **_message_** com uma mensagem adequada;
    - Status esperado: _404 NOT FOUND_.
  - Caso: technology name não é um nome válido com base nos dados existentes na tabela _technologies_
    - Body esperado: um objeto contendo duas chaves:
      - **_message_**: contendo uma mensagem adequada
      - **_option_**: sendo um array contendo todas as tecnologias válidas;
    - Status esperado: _400 BAD REQUEST_.
  - Caso: technology name informado já existe no projeto informado
    - Body esperado: um objeto contendo a chave **_message_** com uma mensagem adequada;
    - Status esperado: _409 CONFLICT_.

- **Exemplos de retornos**:
  | Dados de entrada: |
  | ----------------- |
  | Body: Formato Json |

  ```json
  {
    "name": "MongoDB"
  }
  ```

  - Adicionando uma nova tecnologia com sucesso:
    | Resposta do servidor: |
    | ---------------------------- |
    | Body: nenhum body |
    | Status code: _201 CREATED_ |

    ```json
    {
      "technologyId": 1,
      "technologyName": "MongoDB",
      "projectId": 1,
      "projectName": "Projeto 1",
      "projectDescription": "Projeto fullstack",
      "projectEstimatedTime": "4 meses",
      "projectRepository": "url.com.br",
      "projectStartDate": "2023-12-02T03:00:00.000Z",
      "projectEndDate": "2023-12-10T03:00:00.000Z"
    }
    ```

  - Tentando vincular uma tecnologia, enviando um project id inexistente:

    | Resposta do servidor:        |
    | ---------------------------- |
    | Body: Formato Json           |
    | Status code: _404 NOT FOUND_ |

    ```json
    {
      "message": "Project not found."
    }
    ```

  - Tentando vincular uma tecnologia, enviando um technology name inexistente na tabela de tecnologias:

    | Resposta do servidor:          |
    | ------------------------------ |
    | Body: Formato Json             |
    | Status code: _404 BAD REQUEST_ |

    ```json
    {
      "message": "Technology not supported.",
      "options": [
        "JavaScript",
        "Python",
        "React",
        "Express.js",
        "HTML",
        "CSS",
        "Django",
        "PostgreSQL",
        "MongoDB"
      ]
    }
    ```

  - Tentando vincular uma tecnologia já existente no projeto:

    | Resposta do servidor:       |
    | --------------------------- |
    | Body: Formato Json          |
    | Status code: _409 CONFLICT_ |

    ```json
    {
      "message": "This technology is already associated with the project"
    }
    ```

#

### **DELETE - /projects/:id/technologies/:name**

- Deve ser possível _**desvincular**_ uma _tecnologia_ atrelada a um _projeto_ enviando o _id_ do projeto e _nome_ da tecnologia através da _url_;

- **ATENÇÃO**: a tecnologia não deve ser excluída da tabela _technologies_, mas sim apenas ser _desvinculada_ de um projeto. Para isso deve ser alterada a tabela _projects_technologies_;
- **Sucesso**:
  - Body esperado: nenhum. Não deve retornar nenhum body;
  - Status esperado: _204 NO CONTENT_
- **Falha**:

  - Caso: project id informado não pertence à nenhum project cadastrado
    - Body esperado: um objeto contendo a chave **_message_** com uma mensagem adequada;
    - Status esperado: _404 NOT FOUND_.
  - Caso: technology name informado é válido porém não pertence à nenhum project cadastrado
    - Body esperado: um objeto contendo a chave **_message_** com uma mensagem adequada;
    - Status esperado: _400 BAD REQUEST_.
  - Caso: technology name não é um nome válido com base nos dados existentes na tabela _technologies_
    - Body esperado: um objeto contendo duas chaves:
      - **_message_**: contendo uma mensagem adequada
      - **_option_**: sendo um array contendo todas as tecnologias válidas;
    - Status esperado: _400 BAD REQUEST_.

- **Exemplos de retornos**:

  - Desvinculando uma tecnologia com sucesso:
    | Resposta do servidor: |
    | ---------------------------- |
    | Body: nenhum body |
    | Status code: _204 NO CONTENT_ |

    ```json

    ```

  - Tentando desvincular uma tecnologia, enviando um project id inexistente:

    | Resposta do servidor:        |
    | ---------------------------- |
    | Body: Formato Json           |
    | Status code: _404 NOT FOUND_ |

    ```json
    {
      "message": "Project not found."
    }
    ```

  - Tentando desvincular uma tecnologia, enviando um technology name não vinculado ao projeto:

    | Resposta do servidor:          |
    | ------------------------------ |
    | Body: Formato Json             |
    | Status code: _400 BAD REQUEST_ |

    ```json
    {
      "message": "Technology not related to the project."
    }
    ```

  - Tentando desvincular uma tecnologia, enviando um technology name inexistente na tabela de tecnologias:

    | Resposta do servidor:          |
    | ------------------------------ |
    | Body: Formato Json             |
    | Status code: _400 BAD REQUEST_ |

    ```json
    {
      "message": "Technology not supported.",
      "options": [
        "JavaScript",
        "Python",
        "React",
        "Express.js",
        "HTML",
        "CSS",
        "Django",
        "PostgreSQL",
        "MongoDB"
      ]
    }
    ```
