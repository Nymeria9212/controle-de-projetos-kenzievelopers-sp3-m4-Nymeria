import { NextFunction, Request, Response } from "express";
import { QueryConfig, QueryResult } from "pg";
import format from "pg-format";
import { TDeveloper } from "../interfaces/developersInterfaces";
import { client } from "../database";

const ensureDeveloperDb = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { email } = request.body;

  const queryString: string = `
    SELECT *
    FROM
        developers d
    WHERE d.email =$1 ;
    `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [email],
  };

  const queryResult: QueryResult<TDeveloper> = await client.query(queryConfig);

  if (queryResult.rowCount > 0) {
    return response.status(409).json({
      message: "Email already exists.",
    });
  }
  return next();
};

const ensureDevID = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { id } = request.params;

  const queryString: string = `
      SELECT * 
      FROM
        developers d
      WHERE
        d.id= $1;
  `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult<TDeveloper> = await client.query(queryConfig);

  if (queryResult.rowCount === 0) {
    return response.status(404).json({
      message: "Developer not found",
    });
  }

  return next();
};

export { ensureDeveloperDb, ensureDevID };
