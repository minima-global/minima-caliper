FROM minimaglobal/minima

EXPOSE 9001
EXPOSE 9002
EXPOSE 9003
EXPOSE 9004

ENTRYPOINT ["java", "-jar", "minima.jar", "-private", "-clean"]
