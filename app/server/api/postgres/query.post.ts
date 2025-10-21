import postgres from 'postgres'
import type { PostgresQuery, PostgresResponse } from '~/types/postgres'

// Explicitly import h3 utilities for TypeScript
import { defineEventHandler, readBody } from 'h3'

// Create a singleton connection pool
let sql: ReturnType<typeof postgres> | null = null

function getPostgresConnection() {
  if (!sql) {
    const config = useRuntimeConfig()
    sql = postgres(config.postgresUrl as string, {
      max: 10, // Maximum number of connections in the pool
      idle_timeout: 20,
      connect_timeout: 10,
    })
  }
  return sql
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event) as PostgresQuery
    const sql = getPostgresConnection()

    // Build the query - Don't quote table/column names to let PostgreSQL handle case
    let query = `SELECT * FROM ${body.table}`
    const params: any[] = []
    let paramIndex = 1

    // Add WHERE clause if provided
    if (body.where && Object.keys(body.where).length > 0) {
      const whereConditions = Object.entries(body.where).map(([key, value]) => {
        params.push(value)
        return `${key} = $${paramIndex++}`
      })
      query += ` WHERE ${whereConditions.join(' AND ')}`
    }

    // Add ORDER BY clause if provided
    if (body.order_by) {
      query += ` ORDER BY ${body.order_by}`
    }

    // Add LIMIT clause if provided
    if (body.limit) {
      query += ` LIMIT $${paramIndex++}`
      params.push(body.limit)
    }

    // Add OFFSET clause if provided
    if (body.offset) {
      query += ` OFFSET $${paramIndex++}`
      params.push(body.offset)
    }

    // Execute the query
    const data = await sql.unsafe(query, params)

    // Get total count for pagination (without limit/offset)
    let countQuery = `SELECT COUNT(*) as total FROM ${body.table}`
    if (body.where && Object.keys(body.where).length > 0) {
      const whereConditions = Object.entries(body.where).map(([key, _], index) => {
        return `${key} = $${index + 1}`
      })
      countQuery += ` WHERE ${whereConditions.join(' AND ')}`
    }
    
    const countParams = body.where ? Object.values(body.where) : []
    const countResult = await sql.unsafe(countQuery, countParams)
    const total = parseInt(countResult[0]?.total || '0')

    const result: PostgresResponse = {
      data: data as any[],
      total,
      success: true
    }

    return result
  } catch (error) {
    console.error('PostgreSQL query error:', error)
    
    const result: PostgresResponse = {
      data: [],
      total: 0,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }

    return result
  }
})
