# ==========================================================
# ESTÁGIO 1: CONSTRUÇÃO (Build Stage)
# ==========================================================
# Usamos a imagem oficial com o JDK completo para compilar o projeto
FROM eclipse-temurin:21-jdk-jammy AS build
WORKDIR /app

# Copia os arquivos de configuração do Maven e baixa as dependências
# Isso é feito separadamente para aproveitar o cache de camadas do Docker
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
RUN ./mvnw dependency:go-offline

# Copia o código fonte e gera o artefato empacotado (.jar) pulando testes
COPY src ./src
RUN ./mvnw package -DskipTests

# ==========================================================
# ESTÁGIO 2: EXECUÇÃO (Runtime Stage)
# ==========================================================
# Usamos uma imagem JRE muito menor e mais segura para rodar a aplicação em produção.
# Isso reduz drasticamente o tamanho final do container e mitiga falhas de segurança, 
# já que compiladores e ferramentas de compilação não estarão presentes na imagem final.
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Copia apenas o arquivo .jar compilado no estágio anterior
COPY --from=build /app/target/*.jar app.jar

# Porta em que a aplicação Spring Boot rodará dentro do container
EXPOSE 8080

# Comando para iniciar o container
ENTRYPOINT ["java", "-jar", "app.jar"]
