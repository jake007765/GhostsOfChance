package Pandemonium;

import java.util.ArrayList;

class Demon {

    protected int mesh;
    protected String name;
    protected int[] stats;


    Demon(int mesh, String name) {
        this.mesh = mesh;
        this.name = name;
        ArrayList<Integer> stats = new ArrayList<Integer>();
    }



    @Override
    public String toString() {
        
        return "Mesh: " + mesh + " " + name + "\n" + stats
        ;
    }
}

