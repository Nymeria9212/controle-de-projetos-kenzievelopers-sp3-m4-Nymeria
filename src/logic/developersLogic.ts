import { Request, Response, query, request } from "express";
import {
  TDevAndInfos,
  TDevInfo,
  TDevInfosReq,
  TDevInfosRes,
  TDeveloper,
  TDeveloperRequest,
} from "../interfaces/developersInterfaces";
import format from "pg-format";
import { QueryConfig, QueryResult } from "pg";
import { client } from "../database";

const createDeveloper = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const devReq: TDeveloperRequest = request.body;

  const queryString: string = format(
    `
      INSERT INTO 
        developers (%I)
      VALUES
        (%L)
      RETURNING *;
    `,
    Object.keys(devReq),
    Object.values(devReq)
  );

  const queryResult: QueryResult<TDeveloper> = await client.query(queryString);
  return response.status(201).json(queryResult.rows[0]);
};

const developerIdListen = async (request: Request, response: Response) => {
  const id: number = parseInt(request.params.id);
  const queryString: string = `
  SELECT dev.id "developerId",
  dev."name" "developerName",
  dev."email" "developerEmail",
  di."developerSince" "developerInfoDeveloperSince",
  di."preferredOS" "developerInfoPreferredOS"
  FROM 
  developers dev
  LEFT JOIN
  developer_infos di
  ON
  dev.id =di."developerId"
  WHERE dev.id = $1;
  `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult<TDevAndInfos> = await client.query(
    queryConfig
  );
  return response.status(200).json(queryResult.rows[0]);
};

const updateDeveloper = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const data: Partial<TDeveloper> = request.body;
  const id: number = parseInt(request.params.id);
  const queryString: string = format(
    `
    UPDATE developers d
    SET (%I)=(%L)
    WHERE d.id =$1
    RETURNING *;
  
    `,
    Object.keys(data),
    Object.values(data)
  );

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult = await client.query(queryConfig);
  return response.status(200).json(queryResult.rows[0]);
};

const deleteDeveloper = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const id: number = parseInt(request.params.id);

  const queryString: string = `
      DELETE 
      FROM 
        developers 
      WHERE id=$1;
  `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult = await client.query(queryConfig);

  return response.status(204).json();
};

const createInfodev = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const data: TDevInfosReq = request.body;
  const id: number = parseInt(request.params.id);

  const newInfo: TDevInfo = {
    ...data,
    developerId: id,
  };

  const queryString = format(
    `
      INSERT  INTO 
          developer_infos (%I)
      VALUES (%L)
      RETURNING*
  `,
    Object.keys(newInfo),
    Object.values(newInfo)
  );

  const queryResult: QueryResult<TDevInfosRes> = await client.query(
    queryString
  );

  return response.status(201).json(queryResult.rows[0]);
};

export {
  createDeveloper,
  developerIdListen,
  updateDeveloper,
  deleteDeveloper,
  createInfodev,
};
