# redis

## 역할
- Redis 캐시, 큐, 세션 등 인프라 서비스 관리
- 뉴스 크롤링, 신뢰성 검사 등에서 임시 데이터/캐싱 활용

## 개발 방향
- RedisModule, RedisService 구현
- 주요 서비스와의 연동(뉴스, 신뢰성 검사 등)
- 캐시 전략, 큐/세션 관리 등 인프라 기능 제공

## 기능 TODO
- [ ] RedisModule/Service 구현
- [ ] 뉴스 크롤링 결과 캐싱
- [ ] 신뢰성 검사 큐/임시 데이터 관리
