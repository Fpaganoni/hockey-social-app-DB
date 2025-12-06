import { Injectable } from '@nestjs/common';
import { Client as ElasticClient } from '@elastic/elasticsearch';
import algoliasearch from 'algoliasearch';

@Injectable()
export class SearchService {
  private esClient?: ElasticClient;
  private algoliaIndex?: any;

  constructor() {
    if (process.env.ELASTICSEARCH_NODE) {
      this.esClient = new ElasticClient({ node: process.env.ELASTICSEARCH_NODE });
    }
    if (process.env.ALGOLIA_APP_ID && process.env.ALGOLIA_API_KEY) {
      const client = algoliasearch(process.env.ALGOLIA_APP_ID!, process.env.ALGOLIA_API_KEY!);
      this.algoliaIndex = client.initIndex('entities');
    }
  }

  async indexDoc(id: string, body: any) {
    if (this.esClient) {
      await this.esClient.index({ index: 'entities', id, body });
    }
    if (this.algoliaIndex) {
      await this.algoliaIndex.saveObject({ objectID: id, ...body });
    }
  }

  async search(q: string) {
    if (this.algoliaIndex) {
      return this.algoliaIndex.search(q);
    }
    if (this.esClient) {
      const r = await this.esClient.search({ index: 'entities', q });
      return r.hits.hits;
    }
    return [];
  }
}
