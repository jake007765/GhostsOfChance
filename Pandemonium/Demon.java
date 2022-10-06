package Pandemonium;

class Demon {

    private int mesh;
    private String name;


    Demon(int mesh, String name) {
        this.mesh = mesh;
        this.name = name;
    }

    @Override
    public String toString() {
        
        return mesh + name;
    }
}

