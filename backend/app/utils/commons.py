from databases import Database
from fastapi import Request

# from models import QuerySuggestorModel
from settings import Settings
from db import AsyncClickHouseConnection
# from utils.hybrid_elastic_search import HybridElasticSearch
# from utils.phase1_helper import Phase1Helper
# from utils.phase2_helper import Phase2Helper
# from utils.phase2_qdrant import Phase2QdrantHelper
# from utils.startup_utils import load_query_redirections


def get_postgres_db(request: Request) -> Database:
    return request.app.state.postgres_db.database


def get_clickhouse_db(request: Request) -> AsyncClickHouseConnection:
    return request.app.state.clickhouse_db


# def get_query_suggestor_model(request: Request) -> QuerySuggestorModel:
#    return request.app.state.query_suggestor_model


def get_settings(request: Request) -> Settings:
    return request.app.state.settings


# def get_logger(request: Request) -> Logger:
#     return request.app.state.logger


# def get_redis_client(request: Request):
#     return request.app.state.rclient


def get_redis_cluster_client(request: Request):
    return request.app.state.rcluster_client.redis_db


# def get_elastic_search_client(request: Request) -> ElasticSearchWrapper:
#     return request.app.state.esclient


# def get_phase1_helper(request: Request) -> Phase1Helper:
#     return request.app.state.p1h


# def get_phase2_qdrant_helper(request: Request) -> Phase2QdrantHelper:
#     return request.app.state.p2qh

# def get_phase2_helper(request: Request) -> Phase2Helper:
#     return request.app.state.p2h


# def get_hybrid_elasticsearch_wrapper(request: Request) -> HybridElasticSearch:
#     return request.app.state.hes


# def get_search_feedback_path(request: Request) -> str:
#     return request.app.state.search_feedback_path

# def get_qdrant(request: Request):
#     return request.app.state.qdrant

# def get_query_redirections(request: Request):
#     return request.app.state.query_redirections
