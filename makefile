JFLAGS = -g
JC = javac
JVM = java

CLASSES = \
	src/Db/Rand.java \
	src/Db/Db.java \
	src/Network/Listner.java \
	src/Game/Game.java \
	src/Hangman.java \

all: $(CLASSES:.java=.class)


.SUFFIXES: .java .class
.java.class:
		$(JC) $(JFLAGS) $<


MAIN = Hangman


clean:
		$(RM) src/*.class
		$(RM) src/Db/*.class
		$(RM) src/Network/*.class
		$(RM) src/Game/*.class
		

run: ./src/$(MAIN).java
	@sudo $(JVM) -cp $(shell pwd) src.$(MAIN)





#run: ./src/$(MAIN).java
#	@$(JVM) -cp src $(MAIN)