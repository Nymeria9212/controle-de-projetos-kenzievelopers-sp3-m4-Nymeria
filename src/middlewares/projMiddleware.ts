import { NextFunction, Request, Response, json } from "express";
import { QueryConfig, QueryResult } from "pg";
import { client } from "../database";
import { TDeveloper } from "../interfaces/developersInterfaces";
import { TProjectResponse, TTecnology } from "../interfaces/projectsInterfaces";

const ensureProjectId = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  const id: number = parseInt(request.params.id);

  const queryString: string = `
              SELECT *
              FROM 
                  projects
              WHERE 
                  id=$1
      `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult<TProjectResponse> = await client.query(
    queryConfig
  );

  if (queryResult.rowCount === 0) {
    return response.status(404).json({
      message: "Project not found",
    });
  }

  response.locals.project = queryResult.rows[0];

  return next();
};

const ensureDevInProject = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { developerId } = request.body;

  const queryString: string = `
      SELECT * 
      FROM
        developers 
      WHERE
        id= $1
  `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [developerId],
  };

  const queryResult: QueryResult<TDeveloper> = await client.query(queryConfig);

  if (queryResult.rowCount === 0) {
    return response.status(404).json({
      message: "Developer not found.",
    });
  }

  return next();
};



const tecId = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { name } = request.body;
  const nameParams = request.params.name;

  let queryValues: string[];
  
  if (name && nameParams) {
    // Se ambos estão presentes, use os dois valores
    queryValues = [name, nameParams];
  } else if (name) {
    // Se somente name do body está presente
    queryValues = [name];
  } else {
    // Se somente name dos parâmetros está presente
    queryValues = [nameParams];
  } 

  const queryString: string = `
    SELECT id FROM
      technologies t 
    WHERE 
      t."name" = ANY($1);
  `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [queryValues],
  };

  const queryResult: QueryResult = await client.query(queryConfig);
  
  if (queryResult.rows[0]) {
    console.log(queryResult.rows[0].id);
    
    response.locals.tecId = queryResult.rows[0].id;
  } else {
    return response.status(400).json({
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
    });
  }

  return next();
};


  



const checkTecProjectExists = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  const id: number = parseInt(request.params.id);
  const tech = response.locals.tecId;

  const queryString: string = `
    SELECT pt."technologyId"
    FROM projects p
    FULL JOIN projects_technologies pt ON p.id = pt."projectId"
    WHERE p.id = $1 AND pt."technologyId" = $2;
  `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id, tech],
  };

  const queryResult: QueryResult = await client.query(queryConfig);

  if (request.method === 'POST' && queryResult.rowCount === 1) {
    return response.status(409).json({
      "message": "This technology is already associated with the project"
    });
  }

  if (request.method === 'DELETE' && queryResult.rowCount === 0) {
    return response.status(400).json({
      "message": "Technology not related to the project."
    });
  }

  return next();
};

export {
  ensureProjectId,
  ensureDevInProject,
 
  checkTecProjectExists,
  tecId,
};
