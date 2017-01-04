package poclunrjs.Util;

public enum SparkowConstant {

    LIBELLE_WEB("Libelle_web"), ID_PRODUCT("ProdCustId"), IMAGE_URL("Medium_Img_Url_1");
    private String label;

    SparkowConstant(String attributeId) {
        this.label = attributeId;
    }

    public String getLabel() {
        return label;
    }
}
