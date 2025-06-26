# 베이스 이미지로 Python 3.13.3 버전을 사용
FROM python:3.13.3-slim


# /sample-api 작업 디렉터를 생성
# WORKDIR /sample-api
WORKDIR /app


# 호스트의 소스 코드를 작업 디렉터리로 복사
ADD . .


# requirements.txt 파일에 명시된 패키지를 설치
RUN pip install --no-cache-dir -r requirements.txt


# 컨테이너가 시작될 때 실행할 명령어를 지정
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
# CMD uvicorn main:app --host "0.0.0.0" --port 8000