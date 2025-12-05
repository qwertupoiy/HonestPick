# HonestPick - 음식점 리뷰 및 예약 웹사이트

## 📌 프로젝트 개요
- 개발 기간: 2025.05 ~ 2025.06
- 팀 구성: 2명 (백엔드 개발자 2명)
- 개발 환경: Java, JSP, Servlet, Oracle
예약 기반 리뷰 시스템을 통해 신뢰할 수 있는 음식점 정보를 제공하고,
결제 및 지도 기능을 결합한 실사용 가능한 구조의 웹 서비스를 구현한 프로젝트입니다.

## 🚀 주요 기능
- 예약 기반 리뷰 시스템  
  실제로 예약한 사용자만 리뷰 작성 가능하도록 구현하여 허위 리뷰를 구조적으로 차단
- 멤버십 유료 결제 기능  
  Toss 결제 API를 연동하여 점주가 멤버십을 결제하면 매장이 상단에 노출되도록 설계
- 지도 기능  
  Kakao 지도 API를 활용하여 음식점 위치를 시각적으로 제공
- 관리자 기능  
  회원, 음식점, 리뷰 관리 및 제재 기능 구현

## 🔧 개발 방향 및 협업 방식
백엔드 개발자로만 구성된 팀이었기 때문에,
기능별로 나누기보다는 전체 구조를 함께 설계하고 기능을 분담하여 구현하는 방식으로 진행했습니다.

특히 실제 서비스와 유사한 흐름을 구현하는 데 집중하여
데이터 구조, 사용자 동선, 기능 간 흐름을 고려한 백엔드 설계를 중점적으로 수행했습니다.

## ✅ 담당 기능 및 기여
본 프로젝트에서 백엔드 핵심 기능 전반의 설계 및 구현을 주도적으로 담당했습니다.

- 음식점 / 메뉴 / 리뷰 / 예약 기능 CRUD 설계 및 구현
- 예약 정보와 리뷰 작성 권한을 연동한 검증 로직 구현
- Toss 결제 API 연동 및 멤버십 결제 기능 구현
- 멤버십 매장의 상단 노출 알고리즘 설계
- Kakao 지도 API 연동을 통한 위치 기반 서비스 구현
- 세션/쿠키 기반 자동 로그인 기능 구현
- 관리자 페이지(회원 / 음식점 / 리뷰 관리 및 제재 기능) 구현

단순한 기능 구현이 아닌,
실제 서비스 흐름을 고려한 구조 설계와 데이터 처리 로직을 중심으로 개발을 진행했습니다.

## 💡 기술적 고려사항 및 경험
* 로그인 유지 및 자동 로그인 기능을 세션과 쿠키를 활용해 구현
* JSP/Servlet 구조를 기능 단위로 정리하고, URL을 RESTful하게 설계
* 데이터 정합성과 사용자 권한을 고려한 복합 JOIN 쿼리 작성 경험
* 외부 API 연동(Toss, Kakao)을 통해 실무에 가까운 기능 구현 경험
* 사용자 경험을 고려한 데이터 흐름과 기능 간 연결 구조 설계
→ 단순 CRUD 수준을 넘어 **“서비스 구조를 이해하고 구현하는 경험”**을 얻을 수 있었음

## 발표 자료 (PDF)
▶ [프로젝트 소개 자료 다운로드 (PDF)](https://drive.google.com/file/d/17fujddKVnLxMY6W3MY2no9gvSD2rdjTl/view?usp=sharing)

## 시연 영상
▶ [프로젝트 시연 영상 보기](https://drive.google.com/file/d/1bDkzHl1yo9qC2cL4pnf8bBQMRf2Ma54k/view?usp=sharing)

## 실행 방법 (Getting Started)

### 1. Prerequisites
- JDK: 11.0.26+4  
- Apache Tomcat: 9.0  
- Database: Oracle (XE/Standard/Enterprise)  
- IDE: Eclipse 또는 IntelliJ  

### 2. 프로젝트 설정
```bash
git clone https://github.com/qwertupoiy/HonestPick.git
Eclipse/IntelliJ에서 Dynamic Web Project(또는 Maven Import)로 불러오기  
WebContent/META-INF/context.xml에 Oracle DB 연결 정보 입력
```

```xml
<Resource
    name="jdbc/HonestPick"
    auth="Container"
    type="javax.sql.DataSource"
    driverClassName="oracle.jdbc.driver.OracleDriver"
    url="jdbc:oracle:thin:@localhost:1521:xe"
    username="HonestPick"
    password="1234"
    maxActive="20"
    maxIdle="10"
    maxWait="-1"/>
```

## DB 초기화
sql/HonestPick_create.sql 실행 → 테이블 및 시퀀스 생성  
sql/HonestPick_insert.sql 실행 → 샘플 데이터 삽입  

▶ 실행  
Tomcat 9 서버에 프로젝트 배포 (Run on Server)  
Java Resource / src / home / controller / HomeController.java 실행  
브라우저에서 접속  
http://localhost:8081/HonestPick/Home_servlet/home.do  

▶ 테스트 계정  
관리자: create0508 / wjdwlr123#  
점주: hong123 / wjdwlr123#  
일반 사용자: minsu123 / wjdwlr123#  

## 홈 화면
<img width="954" height="1278" alt="image" src="https://github.com/user-attachments/assets/c43b11a4-01fd-416e-899a-1796d6db96f6" />
