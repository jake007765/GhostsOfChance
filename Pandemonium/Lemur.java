package Pandemonium;

public class Lemur extends Demon {

    private double pitch;

    Lemur(int mesh, String name, double pitch) {
        super(mesh, name);
        this.pitch = pitch;

    }

    @Override
    public String toString() {
        
        return "Mesh: " + mesh + " " + name + "\n" + stats
        ;
    }

    
    
}
