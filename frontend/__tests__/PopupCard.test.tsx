import { render, screen } from "@testing-library/react";
import { PopupCard } from "@/components/PopupCard";

const property = {
  id: 1,
  title: "Test Home",
  price: 350000,
  latitude: 40.0,
  longitude: -75.0,
  address: "123 Main St, Springfield",
  property_type: "house",
  bedrooms: 3,
  bathrooms: 2,
  square_feet: 1500,
  listing_type: "sale",
  status: "available",
  primary_image: "https://picsum.photos/400/300",
};

describe("PopupCard", () => {
  it("renders property details", () => {
    render(<PopupCard property={property as any} />);
    expect(screen.getByText("Test Home")).toBeInTheDocument();
    expect(screen.getByText(/\$350,000/)).toBeInTheDocument();
    expect(screen.getByText(/3 bed/)).toBeInTheDocument();
    expect(screen.getByText(/Springfield/)).toBeInTheDocument();
  });
});
