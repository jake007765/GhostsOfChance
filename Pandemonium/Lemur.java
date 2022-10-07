package Pandemonium;

public class Lemur extends Demon {

    protected double pitch;

    Lemur(int mesh, String name, String title) {
        super(mesh, name, title);


    }

    @Override
    public String toString() {
        
        return "Mesh: " + mesh + " " + name + "\n" + stats
        ;
    }

    
    
}
