import { NextFunction, Request, Response } from "express";
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

const checkTecProjectInsert = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { name } = request.body;
  const nameParamens = request.params.name;
  if (name) {
    if (
      name !== "JavaScript" &&
      name !== "Python" &&
      name !== "React" &&
      name !== "Express.js" &&
      name !== "HTML" &&
      name !== "CSS" &&
      name !== "Django" &&
      name !== "PostgreSQL" &&
      name !== "MongoDB"
    ) {
      return response.status(400).json({
        message: "Technology not supported.",
        options: [
          "JavaScript",
          "Python",
          "React",
          "Express.js",
          "HTML",
          "CSS",
          "Django",
          "PostgreSQL",
          "MongoDB",
        ],
      });
    }
  }
  if (nameParamens) {
    if (
      nameParamens !== "JavaScript" &&
      nameParamens !== "Python" &&
      nameParamens !== "React" &&
      nameParamens !== "Express.js" &&
      nameParamens !== "HTML" &&
      nameParamens !== "CSS" &&
      nameParamens !== "Django" &&
      nameParamens !== "PostgreSQL" &&
      nameParamens !== "MongoDB"
    ) {
      return response.status(400).json({
        message: "Technology not found.",
        options: [
          "JavaScript",
          "Python",
          "React",
          "Express.js",
          "HTML",
          "CSS",
          "Django",
          "PostgreSQL",
          "MongoDB",
        ],
      });
    }
  }
  return next();
};

const tecId = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { name } = request.body;
  const nameParamens = request.params.name;

  if (name) {
    const queryString: string = `
          SELECT id FROM
              technologies t 
          WHERE 
              t."name" =$1;
  `;

    const queryConfig: QueryConfig = {
      text: queryString,
      values: [name],
    };

    const queryResult: QueryResult = await client.query(queryConfig);
    response.locals.tecId = queryResult.rows[0];
  }

  const queryString: string = `
        SELECT id,
        "name" FROM
            technologies t 
        WHERE t."name" =$1;
  `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [nameParamens],
  };

  const queryResult: QueryResult = await client.query(queryConfig);
  response.locals.nameTec = queryResult.rows[0];

  return next();
};

const checkTecProjectExists = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  const id: number = parseInt(request.params.id);

  const queryString: string = `
        SELECT 
            pt."technologyId" 
        FROM 
            projects p 
        FULL JOIN 
            projects_technologies pt 
        ON
            p.id =pt."projectId" 
        WHERE 
            p.id =$1;
  `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };
  const tec = response.locals.tecId;

  const queryResult: QueryResult = await client.query(queryConfig);

  const map = queryResult.rows.map((tecno) => {
    return tecno.technologyId;
  });

  const find = map.find((num) => {
    return num == tec.id;
  });

  console.log(find);
  if (map == undefined) {
    return response
      .status(400)
      .json({ message: "Technology not related to the project." });
  }
  if (find) {
    return response.status(409).json({
      message: "This technology is already associated with the project",
    });
  }

  return next();
};
export {
  ensureProjectId,
  ensureDevInProject,
  checkTecProjectInsert,
  checkTecProjectExists,
  tecId,
};
