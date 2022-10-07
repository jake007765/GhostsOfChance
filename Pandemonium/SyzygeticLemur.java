package Pandemonium;

import java.util.ArrayList;

public class SyzygeticLemur extends Demon {

    SyzygeticLemur(int mesh, String name, String title) {   // syzygetic demons do not have a pitch, set to null
        super(mesh, name, title);
        this.stats = new ArrayList<Integer>();
    }

    @Override
    public String toString() {
        
        return "Mesh: " + mesh + " " + name + "\n" + stats
        ;
    }
    
}
