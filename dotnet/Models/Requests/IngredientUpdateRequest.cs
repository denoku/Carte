namespace Sabio.Models.Requests.Ingredients
{
    public class IngredientUpdateRequest : IngredientAddRequest, IModelIdentifier
    {
        public int Id { get; set; }

    }
}
