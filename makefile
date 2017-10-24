JFLAGS = -g
JC = javac
JVM = java
.SUFFIXES: .java .class
.java.class:
		$(JC) $(JFLAGS) $*.java

CLASSES = \
    src/Hangman.java \
	src/Listner.java \
	src/Game.java \
	src/Db.java \
	src/Rand.java \
	src/Hangman.java \

MAIN = Hangman

default: classes

classes: $(CLASSES:.java=.class)

clean:
		$(RM) src/*.class

run: ./src/$(MAIN).java
	@$(JVM) -cp src $(MAIN)
