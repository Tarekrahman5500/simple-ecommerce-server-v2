/*


import { Client } from '@elastic/elasticsearch';
import {IProduct} from "../model/product";
import {SearchResponse} from "@elastic/elasticsearch/lib/api/types";
import  { ApiResponse} from "@elastic/elasticsearch/lib/api/types"

// Create an Elasticsearch client instance
const client = new Client({ node: 'http://localhost:9200' });

// Define the index and type for the Product model
const index = 'products';
const type = 'product';

// Function to perform the Elasticsearch search
export const searchProducts = async (query: string): Promise<any[]> => {
   try {
    // Create the search request
    const searchRequest: RequestParams.Search = {
      index,
      body: {
        query: {
          match: {
            name: query,
          },
        },
      },
    };

    // Perform the search query
    const { body }: ApiResponse<Response<SearchResponse<IProduct>>> = await client.search(searchRequest);

    // Extract the matching products from the response
    const hits = body.hits.hits;
    const products = hits.map((hit) => hit._source);

    return products;
  } catch (error) {
    console.error('Elasticsearch search error:', error);
    return [];
  }
};*/
