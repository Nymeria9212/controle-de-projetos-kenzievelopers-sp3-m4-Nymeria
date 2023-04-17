import { NextFunction, Request, Response } from "express";
import { QueryConfig, QueryResult } from "pg";
import format from "pg-format";
import { TDevInfosRes, TDeveloper } from "../interfaces/developersInterfaces";
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

const checkOS = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { preferredOS } = request.body;

  if (
    preferredOS !== "Windows" &&
    preferredOS !== "Linux" &&
    preferredOS !== "MacOS"
  ) {
    return response.status(400).json({
      message: "Invalid OS option.",
      options: ["Windows", "Linux", "MacOS"],
    });
  }

  return next();
};

const checkOSExists = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  const id: number = parseInt(request.params.id);

  const queryString: string = `
        SELECT *FROM 
            developer_infos di
        WHERE 
            di."developerId" =$1;
  `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult<TDevInfosRes> = await client.query(
    queryConfig
  );

  if (queryResult.rowCount > 0) {
    return response.status(409).json({
      message: "Developer infos already exists.",
    });
  }

  return next();
};

const ensureInfoDev = async () => {};

export { ensureDeveloperDb, ensureDevID, checkOS, checkOSExists };
